import { useQuery, defineQuery, useQueryCache } from '@pinia/colada'
import { useSolicitudesFiltro } from './useSolicitudesFiltro'
import { useIntervalFn } from '@vueuse/core'
import { queryKeys } from '@/lib/query-keys'
import { solicitudesApi as api } from '@/api/solicitudes'
import { ref, computed, toRefs } from 'vue'

// export interface SolicitudParams {
//   tray?: string
//   state?: string
//   status?: string
//   period?: string
//   search?: string
//   search_in?: string
// }

const STALE_TIME = 1000 * 60 * 5
const ESTADOS_PENDIENTES = ['Solicitado', 'En proceso', 'En evaluación'] as const

export const useSolicitudesQuery = defineQuery(() => {
  const queryCache = useQueryCache()

  const { filtro: params } = toRefs(useSolicitudesFiltro())

  const currentKey = computed(() => queryKeys.solicitudes.lista(params.value))

  const { data, isPending, isLoading, refresh, refetch } = useQuery({
    key: currentKey,
    query: () => api.getAll(params.value),
    enabled: () => Boolean(params.value),
    staleTime: STALE_TIME,
  })

  const now = ref(Date.now())
  useIntervalFn(() => (now.value = Date.now()), 30_000)

  const isStale = computed(() => {
    const entry = queryCache.get(currentKey.value)
    if (!entry || entry.state.value.status !== 'success') return false
    return now.value >= entry.when + STALE_TIME
  })

  const conteoEstados = computed(() => {
    if (params.value.state !== 'pendientes') return []
    const counts: Record<string, number> = {}
    for (const item of data.value?.data ?? []) {
      const estado = item?.[3]
      if (estado) counts[estado] = (counts[estado] ?? 0) + 1
    }
    return ESTADOS_PENDIENTES.map(estado => ({ estado, cantidad: counts[estado] ?? 0 }))
  })

  return {
    solicitudes: computed(() => data.value?.data),
    total: computed(() => data.value?.total),
    isPending,
    isLoading,
    isStale,
    refresh,
    refetch,
    conteoEstados
  }
})