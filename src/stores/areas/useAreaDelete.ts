import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { areasApi as api } from '@/api/areas'

export function useAreaDelete() {
  const queryCache = useQueryCache()

  return useMutation<any, number | string>({
    mutation: (deletedId: number | string) => api.delete(deletedId),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.areas.listas() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.areas.listas() })
    }
  })
}