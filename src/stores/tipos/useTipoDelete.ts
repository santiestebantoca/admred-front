import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { tiposApi as api } from '@/api/tipos'

export function useTipoDelete() {
  const queryCache = useQueryCache()

  return useMutation<any, number | string>({
    mutation: (deletedId: number | string) => api.delete(deletedId),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.tipos.listas() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.tipos.listas() })
    }
  })
}