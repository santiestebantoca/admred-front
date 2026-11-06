import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { usuariosApi as api } from '@/api/usuarios'
import type { Id } from '@/types/api'

export function useUsuarioDelete() {
  const queryCache = useQueryCache()

  return useMutation<number, Id>({
    mutation: (deletedId) => api.delete(deletedId),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.usuarios.listas() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.usuarios.listas() })
    }
  })
}
