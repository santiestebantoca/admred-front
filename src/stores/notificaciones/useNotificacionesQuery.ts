import { useQuery } from '@pinia/colada'
import { notificacionesApi as api } from '@/api/notificaciones'
import { queryKeys } from '@/lib/query-keys'

export const useNotificacionesQuery = () => {
  const { data, isPending, refresh } = useQuery({
    key: () => queryKeys.notificaciones.listas(),
    query: () => api.getAll(),
    autoRefetch: true,
    staleTime: 60000
  })

  return {
    notificaciones: data,
    isPending,
    refresh,
  }
}