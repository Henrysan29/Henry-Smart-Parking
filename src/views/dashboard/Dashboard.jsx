import React from 'react'
import { 
  CCard, 
  CCardBody, 
  CCol, 
  CRow 
} from '@coreui/react'

const Dashboard = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardBody className="text-center py-5">
            {/* Título de bienvenida */}
            <h1 className="display-5 fw-bold text-success mb-3">
              ¡Bienvenido a UTEQ Smart Parking!
            </h1>
            
            {/* Subtítulo */}
            <p className="lead mb-4">
              Sistema Administrativo del Parqueadero Inteligente de la UTEQ.
            </p>
            
            <hr className="my-4" style={{ maxWidth: '600px', margin: '0 auto' }} />
            
            {/* Instrucciones */}
            <p className="text-body-secondary mt-4">
              Por favor, utiliza el menú lateral izquierdo y selecciona la opción <br/>
              <strong>"Vehículos y propietarios"</strong> para comenzar a gestionar los registros.
            </p>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Dashboard