import { ref, computed } from 'vue'
import type { UsuariosParams } from '@/types/api'

const SEARCH_IN = ['name', 'username']

/**
 * Filtros del módulo de usuarios.
 *
 * Composable (no store): cada consumidor tiene su propio estado, así el
 * buscador de un widget no filtra la lista del admin ni al revés.
 */
export function useUsuariosFiltro() {
  const search = ref<string>()
  const nombre = ref<string>()
  const area = ref<number>()
  const rol = ref<string>()
  const estado = ref<string>()

  // Parámetros de filtrado que espera el API
  const filtro = computed<UsuariosParams>(() => ({
    ...nombre.value ? { nombre: nombre.value } : {},
    ...area.value ? { area: area.value } : {},
    ...rol.value ? { rol: rol.value } : {},
    ...estado.value ? { estado: estado.value } : {},
    ...search.value
      ? {
        search: search.value,
        search_in: SEARCH_IN
      } : {},
  }))

  const isFiltered = computed(() => Boolean(Object.keys(filtro.value).length))

  const reset = () => {
    search.value = undefined
    nombre.value = undefined
    area.value = undefined
    rol.value = undefined
    estado.value = undefined
  }

  return {
    nombre,
    area,
    rol,
    estado,
    search,
    filtro,
    isFiltered,
    reset
  }
}
