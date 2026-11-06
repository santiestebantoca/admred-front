import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { areasApi as api } from '@/api/areas'
import type {
  AreaListaItem,
  AreasParams,
  Id,
  ListResponse,
  MetaListado,
} from '@/types/api'
import { tidy, arrange } from '@tidyjs/tidy'
import { ref, computed, toValue, type MaybeRefOrGetter } from 'vue'

/**
 * Consulta de areas del sistema.
 *
 * @param params
 *   Parámetros del API (por ejemplo el `filtro` de `useAreasFiltro` y,
 *   opcionalmente, `page` y `limit`). Acepta un objeto plano, un `ref` o un
 *   `computed`.
 */
export function useAreasQuery(params: MaybeRefOrGetter<AreasParams> = {}) {
  const { data, isPending, isLoading } = useQuery<
    ListResponse<AreaListaItem>
  >({
    key: () => queryKeys.areas.lista(toValue(params)),
    query: () => api.getAll(toValue(params)),
    // Mientras se carga otra página o búsqueda se conserva el resultado
    // anterior: así la tabla y la paginación no "parpadean" ni pierden el total.
    placeholderData: (previousData) => previousData,
  })

  return {
    areas: computed(() => data.value?.data),
    meta: computed<MetaListado | undefined>(() => data.value?.meta),
    isPending,
    isLoading,
  }
}

export function useAreasDelNivelQuery(nivel: MaybeRefOrGetter<Id | null | undefined>) {
  const params = computed<AreasParams>(() => ({ nivel: toValue(nivel) }))

  const { data, isPending, isLoading } = useQuery<
    ListResponse<AreaListaItem>
  >({
    key: () => queryKeys.areas.lista(toValue(params)),
    query: () => api.getAll(toValue(params)),
    enabled: () => !!toValue(nivel),
    staleTime: Infinity
  })

  return {
    areas: computed(() => toValue(nivel) ? data.value?.data : undefined),
    isPending,
    isLoading,
    options: computed(() => data.value?.data.map((d) => ({
      value: d.id,
      text: d.nombre
    })))
  }
}

export function useAreasOpcionesQuery(enabled: MaybeRefOrGetter<boolean>) {
  const search = ref<string>()
  const params = computed<AreasParams>(() => ({
    search: search.value,
    search_in: search.value && ['nombre']
  }))

  const { data, isPending, isLoading } = useQuery<
    ListResponse<AreaListaItem>
  >({
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
