import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Se agregó 'cedula_propietario' para poder cargarla en el formulario de edición
const COLUMNAS_PUBLICAS = `
  id,
  placa,
  marca,
  modelo,
  anio,
  color,
  tipo,
  foto_url,
  foto_fuente_url,
  foto_propietario_url,
  cedula_propietario,
  cedula_enmascarada,
  propietario_nombre,
  correo_institucional,
  autorizado
`

export const useVehiculos = () => {
  const [vehiculos, setVehiculos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // 1. LEER (Consultar)
  const cargarVehiculos = useCallback(async () => {
    setCargando(true)
    setError('')

    const { data, error: errorSupabase } = await supabase
      .from('vehiculos')
      .select(COLUMNAS_PUBLICAS)
      .order('propietario_nombre', { ascending: true })

    if (errorSupabase) {
      setVehiculos([])
      setError(errorSupabase.message)
    } else {
      setVehiculos(data ?? [])
    }
    setCargando(false)
  }, [])

  // 2. CREAR (Insertar)
  const agregarVehiculo = async (nuevoVehiculo) => {
    setError('')
    const { data, error: errorSupabase } = await supabase
      .from('vehiculos')
      .insert([nuevoVehiculo])
      .select()
    
    if (errorSupabase) {
      throw new Error(errorSupabase.message)
    }
    await cargarVehiculos() // Recargar la tabla
    return data
  }

  // 3. ACTUALIZAR (Editar)
  const editarVehiculo = async (id, vehiculoActualizado) => {
    setError('')
    const { data, error: errorSupabase } = await supabase
      .from('vehiculos')
      .update(vehiculoActualizado)
      .eq('id', id)
      .select()

    if (errorSupabase) {
      throw new Error(errorSupabase.message)
    }
    await cargarVehiculos() // Recargar la tabla
    return data
  }

  // 4. ELIMINAR (Borrar)
  const eliminarVehiculo = async (id) => {
    setError('')
    const { error: errorSupabase } = await supabase
      .from('vehiculos')
      .delete()
      .eq('id', id)

    if (errorSupabase) {
      throw new Error(errorSupabase.message)
    }
    await cargarVehiculos() // Recargar la tabla
  }

  useEffect(() => {
    cargarVehiculos()
  }, [cargarVehiculos])

  return {
    vehiculos,
    cargando,
    error,
    recargar: cargarVehiculos,
    agregarVehiculo,
    editarVehiculo,
    eliminarVehiculo
  }
}