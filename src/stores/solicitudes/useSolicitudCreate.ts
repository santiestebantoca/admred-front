import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { solicitudesApi as api } from '@/api/solicitudes'
import type { InsertResult } from '@/types/api'
import type { SolicitudCreate, SolicitudCreateFromParent } from '@/types/models'

export function useSolicitudCreate() {
  const queryCache = useQueryCache()

  return useMutation<InsertResult, SolicitudCreate | SolicitudCreateFromParent>({
    mutation: (newData) => api.create(newData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.solicitudes.listas() })
      queryCache.cancelQueries({ key: queryKeys.solicitudes.detalles() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.solicitudes.listas() })
      queryCache.invalidateQueries({ key: queryKeys.solicitudes.detalles() })
    }
  })
}
