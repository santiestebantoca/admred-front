import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { reportesApi as api } from '@/api/reportes'
import type { ReportePendientesResponse } from '@/types/api'

export const usePendientesQuery = () => {
  const { data, isPending, refresh } = useQuery<ReportePendientesResponse>({
    key: () => queryKeys.reportes.pendientes.listas(),
    query: () => api.pendientes.getAll(),
  })

  return {
    pendientes: data,
    isPending,
    refresh,
  }
}
