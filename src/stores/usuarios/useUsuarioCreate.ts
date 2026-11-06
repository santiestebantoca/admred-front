import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { usuariosApi as api } from '@/api/usuarios'
import type { InsertResult } from '@/types/api'
import type { UsuarioCreate } from '@/types/models'

export function useUsuarioCreate() {
  const queryCache = useQueryCache()

  return useMutation<InsertResult, UsuarioCreate>({
    mutation: (newData) => api.create(newData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.usuarios.listas() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.usuarios.listas() })
    }
  })
}
