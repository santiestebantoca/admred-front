import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { solicitudesApi as api } from '@/api/solicitudes'
import type { SolicitudUpdate } from '@/types/models'

export function useSolicitudUpdate() {
  const queryCache = useQueryCache()

  return useMutation<any, SolicitudUpdate>({
    mutation: ({ id, ...updatedData }) => api.update(id, updatedData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.notificaciones.listas() })
      queryCache.cancelQueries({ key: queryKeys.solicitudes.listas() })
      queryCache.cancelQueries({ key: queryKeys.solicitudes.detalles() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.notificaciones.listas() })
      queryCache.invalidateQueries({ key: queryKeys.solicitudes.listas() })
      queryCache.invalidateQueries({ key: queryKeys.solicitudes.detalles() })
    }
  })
}