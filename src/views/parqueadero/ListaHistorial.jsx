import React from 'react'
import { CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CBadge, CSpinner } from '@coreui/react'
import { useHistorial } from '../../hooks/useHistorial'

const ListaHistorial = () => {
  const { historial, cargando } = useHistorial()

  return (
    <CCard>
      <CCardHeader><strong>Historial de Parqueo</strong></CCardHeader>
      <CCardBody>
        {cargando ? <CSpinner color="primary" /> : (
          <CTable striped hover responsive align="middle">
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell>Registro</CTableHeaderCell>
                <CTableHeaderCell>Placa Detectada</CTableHeaderCell>
                <CTableHeaderCell>Entrada</CTableHeaderCell>
                <CTableHeaderCell>Salida / Duración</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {historial.map(h => (
                <CTableRow key={h.id}>
                  <CTableDataCell><strong>{h.codigo_registro}</strong></CTableDataCell>
                  <CTableDataCell><CBadge color="dark">{h.placa_detectada}</CBadge></CTableDataCell>
                  <CTableDataCell>{new Date(h.fecha_entrada).toLocaleString()}</CTableDataCell>
                  <CTableDataCell>
                    {h.fecha_salida ? new Date(h.fecha_salida).toLocaleString() : '---'}
                    {h.duracion_minutos && <div className="small text-muted">{h.duracion_minutos} min</div>}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={h.estado === 'ACTIVO' ? 'primary' : 'secondary'}>{h.estado}</CBadge>
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
export default ListaHistorial