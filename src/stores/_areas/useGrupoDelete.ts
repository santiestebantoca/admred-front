import { useMutation, useQueryCache } from '@pinia/colada'
import { gruposApi as api } from '@/api/grupos'
import { queryKeys } from '@/lib/query-keys'

export function useGrupoDelete() {
  const queryCache = useQueryCache()

  return useMutation<any, number | string>({
    mutation: (deletedId: number | string) => api.delete(deletedId),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.grupos.listas() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.grupos.listas() })
    }
  })
}