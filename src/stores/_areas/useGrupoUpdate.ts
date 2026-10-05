import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { gruposApi as api } from '@/api/grupos'
import type { GrupoUpdate } from '@/types/models'

export function useGrupoUpdate() {
  const queryCache = useQueryCache()

  return useMutation<any, GrupoUpdate>({
    mutation: ({ id, ...updatedData }) => api.update(id, updatedData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.grupos.listas() })
      queryCache.cancelQueries({ key: queryKeys.grupos.detalles() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.grupos.listas() })
      queryCache.invalidateQueries({ key: queryKeys.grupos.detalles() })
    }
  })
}