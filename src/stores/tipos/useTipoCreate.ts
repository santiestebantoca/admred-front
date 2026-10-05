import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { tiposApi as api } from '@/api/tipos'
// import type { TipoCreate } from '@/types/models'

export function useTipoCreate() {
  const queryCache = useQueryCache()

  // return useMutation<any, TipoCreate>({
  return useMutation({
    mutation: (newData) => api.create(newData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.tipos.listas() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.tipos.listas() })
    }
  })
}