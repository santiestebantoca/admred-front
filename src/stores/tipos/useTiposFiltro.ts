import { ref, computed } from 'vue'

const SEARCH_IN = ['nombre', 'descripcion']

/**
 * Filtros del módulo de tipos.
 *
 * Composable (no store): cada consumidor tiene su propio estado, así el
 * buscador de un widget no filtra la lista del admin ni al revés.
 */
export function useTiposFiltro() {
  const search = ref(undefined)
  const nombre = ref(undefined)
  const descripcion = ref(undefined)

  // Parámetros de filtrado que espera el API
  const filtro = computed(() => ({
    ...nombre.value ? { nombre: nombre.value } : {},
    ...descripcion.value ? { descripcion: descripcion.value } : {},
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
  }

  return {
    nombre,
    descripcion,
    search,
    filtro,
    isFiltered,
    reset
  }
}
