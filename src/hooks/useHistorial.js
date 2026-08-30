import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export const useHistorial = () => {
  const [historial, setHistorial] = useState([])
  const [cargando, setCargando] = useState(true)

  // 1. EXTRAER
  const cargarHistorial = useCallback(async () => {
    setCargando(true)
    const { data } = await supabase.from('registros_estacionamiento').select('*').order('fecha_entrada', { ascending: false })
    setHistorial(data ?? [])
    setCargando(false)
  }, [])

  // 2. INSERTAR
  const agregarHistorial = async (nuevoRegistro) => {
    const { data, error } = await supabase.from('registros_estacionamiento').insert([nuevoRegistro]).select()
    if (error) throw new Error(error.message)
    await cargarHistorial()
    return data
  }

  // 3. ACTUALIZAR
  const editarHistorial = async (id, datosActualizados) => {
    const { data, error } = await supabase.from('registros_estacionamiento').update(datosActualizados).eq('id', id).select()
    if (error) throw new Error(error.message)
    await cargarHistorial()
    return data
  }

  // 4. ELIMINAR
  const eliminarHistorial = async (id) => {
    const { error } = await supabase.from('registros_estacionamiento').delete().eq('id', id)
    if (error) throw new Error(error.message)
    await cargarHistorial()
  }

  useEffect(() => { cargarHistorial() }, [cargarHistorial])

  return { historial, cargando, recargar: cargarHistorial, agregarHistorial, editarHistorial, eliminarHistorial }
}