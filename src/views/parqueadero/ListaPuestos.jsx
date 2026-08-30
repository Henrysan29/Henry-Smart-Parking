import React from 'react'
import { CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CBadge, CSpinner } from '@coreui/react'
import { usePuestos } from '../../hooks/usePuestos'

const ListaPuestos = () => {
  const { puestos, cargando } = usePuestos()

  return (
    <CCard>
      <CCardHeader><strong>Gestión de Puestos</strong></CCardHeader>
      <CCardBody>
        {cargando ? <CSpinner color="primary" /> : (
          <CTable striped hover responsive align="middle">
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell>Código</CTableHeaderCell>
                <CTableHeaderCell>Columna / Número</CTableHeaderCell>
                <CTableHeaderCell>Sensor (Firebase)</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {puestos.map(p => (
                <CTableRow key={p.id}>
                  <CTableDataCell><strong>{p.codigo}</strong></CTableDataCell>
                  <CTableDataCell>Columna {p.columna} - Puesto {p.numero}</CTableDataCell>
                  <CTableDataCell><code className="small">{p.ruta_firebase}</code></CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={p.estado === 'DISPONIBLE' ? 'success' : p.estado === 'OCUPADO' ? 'danger' : 'warning'}>
                      {p.estado}
                    </CBadge>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>
    </CCard>
  )
}
export default ListaPuestos