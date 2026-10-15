import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { areasApi as api } from '@/api/areas'
import { tidy, arrange } from '@tidyjs/tidy'
import { ref, computed, toValue } from 'vue'

/**
 * Consulta de areas del sistema.
 *
 * @param params
 *   Parámetros del API (por ejemplo el `filtro` de `useAreasFiltro` y,
 *   opcionalmente, `page` y `limit`). Acepta un objeto plano, un `ref` o un
 *   `computed`.
 */
export function useAreasQuery(params = {}) {
  const { data, isPending, isLoading } = useQuery({
    key: () => queryKeys.areas.lista(toValue(params)),
    query: () => api.getAll(toValue(params)),
    // Mientras se carga otra página o búsqueda se conserva el resultado
    // anterior: así la tabla y la paginación no "parpadean" ni pierden el total.
    placeholderData: (previousData) => previousData,
  })

  return {
    areas: computed(() => data.value?.data),
    meta: computed(() => data.value?.meta),
    isPending,
    isLoading,
  }
}

export function useAreasDelNivelQuery(nivel) {
  const params = computed(() => ({ nivel: toValue(nivel) }))

  const { data, isPending, isLoading } = useQuery({
    key: () => queryKeys.areas.lista(toValue(params)),
    query: () => api.getAll(toValue(params)),
    enabled: () => toValue(nivel),
    staleTime: Infinity
  })

  return {
    areas: computed(() => toValue(nivel) ? data.value?.data : undefined),
    isPending,
    isLoading,
  }
}

export function useAreasOpcionesQuery(enabled) {
  const search = ref(undefined)
  const params = computed(() => ({
    search: search.value,
    search_in: search.value && ['nombre']
  }))

  const { data, isPending, isLoading } = useQuery({
    key: () => queryKeys.areas.lista(params.value),
    query: () => api.getAll(params.value),
    enabled: () => toValue(enabled),
    staleTime: Infinity
  })

  const areas = computed(() => tidy(
    data.value?.data.map((d) => ({ text: d.nombre, value: d.id })) || [],
    arrange(['text'])
  ))

  return {
    areas,
    search,
    isPending,
    isLoading,
  }
}