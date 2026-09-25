import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { reportesApi as api } from '@/api/reportes'

export const usePendientesQuery = () => {
  const { data, isPending, refresh } = useQuery({
    key: () => queryKeys.reportes.pendientes.listas(),
    query: () => api.pendientes.getAll(),
    staleTime: Infinity
  })

  return {
    pendientes: data,
    isPending,
    refresh,
  }
}
