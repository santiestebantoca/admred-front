import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { tiposApi as api } from '@/api/tipos'
import type { Id } from '@/types/api'

export function useTipoDelete() {
  const queryCache = useQueryCache()

  return useMutation<number, Id>({
    mutation: (deletedId) => api.delete(deletedId),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.tipos.listas() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.tipos.listas() })
    }
  })
}
