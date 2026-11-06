import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { areasApi as api } from '@/api/areas'
import type { InsertResult } from '@/types/api'
import type { AreaCreate } from '@/types/models'

export function useAreaCreate() {
  const queryCache = useQueryCache()

  return useMutation<InsertResult, AreaCreate>({
    mutation: (newData) => api.create(newData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.areas.listas() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.areas.listas() })
    }
  })
}
