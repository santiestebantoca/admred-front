import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { areasApi as api } from '@/api/areas'
import type { Id } from '@/types/api'

export function useAreaDelete() {
  const queryCache = useQueryCache()

  return useMutation<number, Id>({
    mutation: (deletedId: Id) => api.delete(deletedId),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.areas.listas() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.areas.listas() })
    }
  })
}
