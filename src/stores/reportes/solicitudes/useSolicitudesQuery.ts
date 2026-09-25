import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { reportesApi as api } from '@/api/reportes'
import { ref } from 'vue'

export const useSolicitudesQuery = () => {
  const params = ref({
    desde: undefined,
    hasta: undefined,
    destino_id: undefined
  })

  const { data, isPending, isLoading, refresh } = useQuery({
    key: () => queryKeys.reportes.solicitudes.lista(params.value),
    query: () => api.solicitudes.getAll(params.value),
    enabled: () => Object.values(params.value).every(v => v != null),
    staleTime: Infinity
  })

  return {
    solicitudes: data,
    isPending,
    isLoading,
    refresh,
    params
  }
}