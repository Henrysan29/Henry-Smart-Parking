import React, { useEffect, useMemo, useState } from 'react'
import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CCol,
  CRow
} from '@coreui/react'
import { cilPen, cilTrash, cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useVehiculos } from '../../hooks/useVehiculos'

const estadoInicialFormulario = {
  placa: '', marca: '', modelo: '', anio: '', color: '', tipo: 'AUTOMOVIL',
  foto_url: '', foto_fuente_url: '', foto_propietario_url: '',
  cedula_propietario: '', propietario_nombre: '', correo_institucional: '', autorizado: true
}

const ListaVehiculos = () => {
  const { vehiculos, cargando, error, recargar, agregarVehiculo, editarVehiculo, eliminarVehiculo } = useVehiculos()
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(1)
  const vehiculosPorPagina = 10

  // Estados para Modales y CRUD
  const [modalFormulario, setModalFormulario] = useState(false)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null)
  const [formData, setFormData] = useState(estadoInicialFormulario)
  const [guardando, setGuardando] = useState(false)
  const [mensajeExito, setMensajeExito] = useState('')
  const [mensajeError, setMensajeError] = useState('')

  useEffect(() => {
    setPagina(1)
  }, [busqueda])

  const vehiculosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    if (!texto) return vehiculos
    return vehiculos.filter((vehiculo) =>
      [vehiculo.placa, vehiculo.marca, vehiculo.modelo, vehiculo.color, vehiculo.propietario_nombre, vehiculo.correo_institucional]
        .some((valor) => valor?.toLowerCase().includes(texto)),
    )
  }, [vehiculos, busqueda])

  const totalPaginas = Math.max(1, Math.ceil(vehiculosFiltrados.length / vehiculosPorPagina))
  const paginaActual = Math.min(pagina, totalPaginas)
  const vehiculosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * vehiculosPorPagina
    return vehiculosFiltrados.slice(inicio, inicio + vehiculosPorPagina)
  }, [vehiculosFiltrados, paginaActual])

  // Manejadores del Formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const abrirModalAgregar = () => {
    setFormData(estadoInicialFormulario)
    setVehiculoSeleccionado(null)
    setMensajeError('')
    setModalFormulario(true)
  }

  const abrirModalEditar = (vehiculo) => {
    setFormData({ ...vehiculo })
    setVehiculoSeleccionado(vehiculo)
    setMensajeError('')
    setModalFormulario(true)
  }

  const abrirModalEliminar = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo)
    setMensajeError('')
    setModalEliminar(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setMensajeError('')
    try {
      if (vehiculoSeleccionado) {
        // Extraemos solo los campos que pertenecen a la DB
        const { id, cedula_enmascarada, ...datosActualizados } = formData
        await editarVehiculo(vehiculoSeleccionado.id, datosActualizados)
        mostrarExito('Registro actualizado correctamente')
      } else {
        await agregarVehiculo(formData)
        mostrarExito('Vehículo registrado correctamente')
      }
      setModalFormulario(false)
    } catch (err) {
      setMensajeError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  const confirmarEliminacion = async () => {
    setGuardando(true)
    setMensajeError('')
    try {
      await eliminarVehiculo(vehiculoSeleccionado.id)
      mostrarExito('Registro eliminado correctamente')
      setModalEliminar(false)
    } catch (err) {
      setMensajeError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  const mostrarExito = (mensaje) => {
    setMensajeExito(mensaje)
    setTimeout(() => setMensajeExito(''), 4000)
  }

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <div>
          <strong>Vehículos y propietarios</strong>
          <div className="small text-body-secondary">Administración de UTEQ Smart Parking</div>
        </div>
        <div className="d-flex gap-2">
          <CButton color="primary" onClick={abrirModalAgregar} disabled={cargando}>
            <CIcon icon={cilPlus} className="me-2" /> Agregar Nuevo
          </CButton>
          <CButton color="success" onClick={recargar} disabled={cargando}>
            Actualizar
          </CButton>
        </div>
      </CCardHeader>

      <CCardBody>
        {mensajeExito && <CAlert color="success" dismissible>{mensajeExito}</CAlert>}
        
        <div className="d-flex justify-content-between align-items-center mb-3 gap-3">
          <CFormInput type="search" placeholder="Buscar placa, vehículo o propietario..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={{ maxWidth: '420px' }} />
          <span className="text-body-secondary">{vehiculosFiltrados.length} vehículos</span>
        </div>

        {cargando && (
          <div className="text-center py-5">
            <CSpinner color="success" />
            <p className="mt-3">Cargando vehículos...</p>
          </div>
        )}

        {!cargando && error && <CAlert color="danger">Error al cargar: {error}</CAlert>}

        {!cargando && !error && (
          <>
            <CTable align="middle" bordered hover responsive striped>
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell>Foto Vehículo</CTableHeaderCell>
                  <CTableHeaderCell>Placa</CTableHeaderCell>
                  <CTableHeaderCell>Vehículo</CTableHeaderCell>
                  <CTableHeaderCell>Año/Color</CTableHeaderCell>
                  <CTableHeaderCell>Propietario (SGA)</CTableHeaderCell>
                  <CTableHeaderCell>Datos Propietario</CTableHeaderCell>
                  <CTableHeaderCell>Estado</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {vehiculosPaginados.length === 0 ? (
                  <CTableRow><CTableDataCell colSpan={8} className="text-center py-4">No hay datos.</CTableDataCell></CTableRow>
                ) : (
                  vehiculosPaginados.map((vehiculo) => (
                    <CTableRow key={vehiculo.id}>
                      <CTableDataCell>
                        <img src={vehiculo.foto_url} alt={vehiculo.marca} width="80" height="50" style={{ objectFit: 'cover', borderRadius: '4px' }} />
                      </CTableDataCell>
                      <CTableDataCell><CBadge color="dark">{vehiculo.placa}</CBadge></CTableDataCell>
                      <CTableDataCell><strong>{vehiculo.marca}</strong><div className="small">{vehiculo.modelo}</div></CTableDataCell>
                      <CTableDataCell>{vehiculo.anio}<div className="small">{vehiculo.color}</div></CTableDataCell>
                      <CTableDataCell className="text-center">
                        <img src={vehiculo.foto_propietario_url} alt="Propietario" width="50" height="50" style={{ objectFit: 'cover', borderRadius: '50%' }} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <strong>{vehiculo.propietario_nombre}</strong>
                        <div className="small">{vehiculo.cedula_enmascarada}</div>
                        <div className="small text-muted">{vehiculo.correo_institucional}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={vehiculo.autorizado ? 'success' : 'danger'}>{vehiculo.autorizado ? 'Autorizado' : 'Inactivo'}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <CButton color="info" variant="outline" size="sm" onClick={() => abrirModalEditar(vehiculo)} title="Editar">
                            <CIcon icon={cilPen} />
                          </CButton>
                          <CButton color="danger" variant="outline" size="sm" onClick={() => abrirModalEliminar(vehiculo)} title="Eliminar">
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>

            {/* Paginación */}
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-body-secondary">Página {paginaActual} de {totalPaginas}</small>
              <div className="d-flex gap-2">
                <CButton color="secondary" variant="outline" disabled={paginaActual === 1} onClick={() => setPagina((p) => Math.max(1, p - 1))}>Anterior</CButton>
                <CButton color="success" variant="outline" disabled={paginaActual === totalPaginas} onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}>Siguiente</CButton>
              </div>
            </div>
          </>
        )}

        {/* Modal Crear/Editar */}
        <CModal visible={modalFormulario} onClose={() => !guardando && setModalFormulario(false)} size="lg" backdrop="static">
          <CModalHeader>
            <CModalTitle>{vehiculoSeleccionado ? 'Editar Registro' : 'Nuevo Registro'}</CModalTitle>
          </CModalHeader>
          <CForm onSubmit={handleSubmit}>
            <CModalBody>
              {mensajeError && <CAlert color="danger">{mensajeError}</CAlert>}
              <CRow className="g-3">
                <CCol md={6}>
                  <CFormInput label="Placa" name="placa" value={formData.placa} onChange={handleChange} required placeholder="ABC-1234" pattern="^[A-Z]{3}-[0-9]{4}$" />
                </CCol>
                <CCol md={6}>
                  <CFormSelect label="Tipo" name="tipo" value={formData.tipo} onChange={handleChange}>
                    <option value="AUTOMOVIL">Automóvil</option>
                    <option value="CAMIONETA">Camioneta</option>
                    <option value="SUV">SUV</option>
                    <option value="MOTOCICLETA">Motocicleta</option>
                  </CFormSelect>
                </CCol>
                <CCol md={6}><CFormInput label="Marca" name="marca" value={formData.marca} onChange={handleChange} required /></CCol>
                <CCol md={6}><CFormInput label="Modelo" name="modelo" value={formData.modelo} onChange={handleChange} required /></CCol>
                <CCol md={6}><CFormInput type="number" label="Año" name="anio" value={formData.anio} onChange={handleChange} required min="1990" max="2035" /></CCol>
                <CCol md={6}><CFormInput label="Color" name="color" value={formData.color} onChange={handleChange} required /></CCol>
                <CCol md={12}><CFormInput label="URL Foto del Vehículo" name="foto_url" value={formData.foto_url} onChange={handleChange} required /></CCol>
                <CCol md={12}><CFormInput label="URL Fuente de la Foto (Créditos)" name="foto_fuente_url" value={formData.foto_fuente_url} onChange={handleChange} required /></CCol>
                <hr className="mt-4" />
                <h6 className="mb-3">Datos del Propietario</h6>
                <CCol md={6}><CFormInput label="Cédula" name="cedula_propietario" value={formData.cedula_propietario} onChange={handleChange} required pattern="^[0-9]{10}$" title="Debe contener 10 dígitos numéricos" /></CCol>
                <CCol md={6}><CFormInput label="Nombre Completo" name="propietario_nombre" value={formData.propietario_nombre} onChange={handleChange} required /></CCol>
                <CCol md={6}><CFormInput type="email" label="Correo Institucional" name="correo_institucional" value={formData.correo_institucional} onChange={handleChange} required /></CCol>
                <CCol md={6}><CFormInput label="URL Foto del Propietario (SGA)" name="foto_propietario_url" value={formData.foto_propietario_url} onChange={handleChange} required /></CCol>
                <CCol md={12}>
                  <CFormSelect label="Estado de Autorización" name="autorizado" value={formData.autorizado} onChange={(e) => setFormData({ ...formData, autorizado: e.target.value === 'true' })}>
                    <option value="true">Autorizado (Ingreso permitido)</option>
                    <option value="false">No Autorizado</option>
                  </CFormSelect>
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setModalFormulario(false)} disabled={guardando}>Cancelar</CButton>
              <CButton color="primary" type="submit" disabled={guardando}>
                {guardando ? <CSpinner size="sm" /> : 'Guardar Datos'}
              </CButton>
            </CModalFooter>
          </CForm>
        </CModal>

        {/* Modal Eliminar */}
        <CModal visible={modalEliminar} onClose={() => !guardando && setModalEliminar(false)}>
          <CModalHeader><CModalTitle>Confirmar Eliminación</CModalTitle></CModalHeader>
          <CModalBody>
            {mensajeError && <CAlert color="danger">{mensajeError}</CAlert>}
            ¿Está seguro de que desea eliminar el vehículo con placa <strong>{vehiculoSeleccionado?.placa}</strong> de <strong>{vehiculoSeleccionado?.propietario_nombre}</strong>? Esta acción no se puede deshacer.
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setModalEliminar(false)} disabled={guardando}>Cancelar</CButton>
            <CButton color="danger" onClick={confirmarEliminacion} disabled={guardando}>
              {guardando ? <CSpinner size="sm" /> : 'Sí, Eliminar'}
            </CButton>
          </CModalFooter>
        </CModal>

      </CCardBody>
    </CCard>
  )
}

export default ListaVehiculos