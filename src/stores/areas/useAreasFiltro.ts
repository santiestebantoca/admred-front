import { ref, computed } from 'vue'

const SEARCH_IN = ['nombre', 'padre', 'nivel']

/**
 * Filtros del módulo de areas.
 *
 * Composable (no store): cada consumidor tiene su propio estado, así el
 * buscador de un widget no filtra la lista del admin ni al revés.
 */
export function useAreasFiltro() {
  const search = ref(undefined)
  const nombre = ref(undefined)
  const padre = ref(undefined)
  const nivel = ref(undefined)
  const rol_key = ref(undefined)

  // Parámetros de filtrado que espera el API
  const filtro = computed(() => ({
    ...nombre.value ? { nombre: nombre.value } : {},
    ...padre.value ? { padre: padre.value } : {},
    ...nivel.value ? { nivel: nivel.value } : {},
    ...rol_key.value ? { rol_key: rol_key.value } : {},
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
    padre.value = undefined
    nivel.value = undefined
    rol_key.value = undefined
  }

  return {
    nombre,
    padre,
    nivel,
    rol_key,
    search,
    filtro,
    isFiltered,
    reset
  }
}
