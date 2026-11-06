import { ref, computed } from 'vue'
import type { TiposParams } from '@/types/api'

const SEARCH_IN = ['nombre', 'descripcion']

/**
 * Filtros del módulo de tipos.
 *
 * Composable (no store): cada consumidor tiene su propio estado, así el
 * buscador de un widget no filtra la lista del admin ni al revés.
 */
export function useTiposFiltro() {
  const search = ref<string>()
  const nombre = ref<string>()
  const descripcion = ref<string>()
  /** `'0'` (sin uso) o el máximo de usos para "poco uso". */
  const uso = ref<string>()

  // Parámetros de filtrado que espera el API
  const filtro = computed<TiposParams>(() => ({
    ...nombre.value ? { nombre: nombre.value } : {},
    ...descripcion.value ? { descripcion: descripcion.value } : {},
    ...uso.value ? { uso: uso.value } : {},
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
    descripcion.value = undefined
    uso.value = undefined
  }

  return {
    nombre,
    descripcion,
    uso,
    search,
    filtro,
    isFiltered,
    reset
  }
}
