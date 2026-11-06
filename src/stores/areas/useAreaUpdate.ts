import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { areasApi as api } from '@/api/areas'
import type { UpdateResult } from '@/types/api'
import type { AreaUpdate } from '@/types/models'

export function useAreaUpdate() {
  const queryCache = useQueryCache()

  return useMutation<UpdateResult, AreaUpdate>({
    mutation: ({ id, ...updatedData }) => api.update(id, updatedData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.areas.listas() })
      queryCache.cancelQueries({ key: queryKeys.areas.detalles() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.areas.listas() })
      queryCache.invalidateQueries({ key: queryKeys.areas.detalles() })
    }
  })
}
