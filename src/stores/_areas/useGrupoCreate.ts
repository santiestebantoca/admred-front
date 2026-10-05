import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { gruposApi as api } from '@/api/grupos'
import type { GrupoCreate } from '@/types/models'

export function useGrupoCreate() {
  const queryCache = useQueryCache()

  return useMutation<any, GrupoCreate>({
    mutation: (newData) => api.create(newData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.grupos.listas() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.grupos.listas() })
    }
  })
}