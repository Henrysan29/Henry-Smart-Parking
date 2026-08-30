import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export const usePuestos = () => {
  const [puestos, setPuestos] = useState([])
  const [cargando, setCargando] = useState(true)

  // 1. EXTRAER
  const cargarPuestos = useCallback(async () => {
    setCargando(true)
    const { data } = await supabase.from('puestos').select('*').order('codigo', { ascending: true })
    setPuestos(data ?? [])
    setCargando(false)
  }, [])

  // 2. INSERTAR
  const agregarPuesto = async (nuevoPuesto) => {
    const { data, error } = await supabase.from('puestos').insert([nuevoPuesto]).select()
    if (error) throw new Error(error.message)
    await cargarPuestos()
    return data
  }

  // 3. ACTUALIZAR
  const editarPuesto = async (id, datosActualizados) => {
    const { data, error } = await supabase.from('puestos').update(datosActualizados).eq('id', id).select()
    if (error) throw new Error(error.message)
    await cargarPuestos()
    return data
  }

  // 4. ELIMINAR
  const eliminarPuesto = async (id) => {
    const { error } = await supabase.from('puestos').delete().eq('id', id)
    if (error) throw new Error(error.message)
    await cargarPuestos()
  }

  useEffect(() => { cargarPuestos() }, [cargarPuestos])

  return { puestos, cargando, recargar: cargarPuestos, agregarPuesto, editarPuesto, eliminarPuesto }
}