import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { solicitudesApi as api } from '@/api/solicitudes'
import { ref } from 'vue'

export function useSolicitudesQuery() {
  const params = ref(undefined)

  const { data, isPending, isLoading, refresh } = useQuery({
    key: () => queryKeys.solicitudes.lista(params.value),
    query: () => api.getAll(params.value),
    enabled: () => params.value?.tray && params.value?.state,
  })

  return {
    solicitudes: data,
    isPending,
    isLoading,
    refresh,
    params
  }
}