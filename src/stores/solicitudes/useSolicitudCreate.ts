import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { solicitudesApi as api } from '@/api/solicitudes'
import type { SolicitudCreate } from '@/types/models'

export function useSolicitudCreate() {
  const queryCache = useQueryCache()

  return useMutation<any, SolicitudCreate>({
    mutation: (newData) => api.create(newData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.solicitudes.listas() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.solicitudes.listas() })
    }
  })
}