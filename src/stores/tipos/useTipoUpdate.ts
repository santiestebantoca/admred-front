import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { tiposApi as api } from '@/api/tipos'
import type { TipoUpdate } from '@/types/models'

export function useTipoUpdate() {
  const queryCache = useQueryCache()

  return useMutation<any, TipoUpdate>({
    mutation: ({ id, ...updatedData }) => api.update(id, updatedData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.tipos.listas() })
      queryCache.cancelQueries({ key: queryKeys.tipos.detalles() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.tipos.listas() })
      queryCache.invalidateQueries({ key: queryKeys.tipos.detalles() })
    }
  })
}