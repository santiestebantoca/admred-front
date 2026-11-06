import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { usuariosApi as api } from '@/api/usuarios'
import type { UpdateResult } from '@/types/api'
import type { UsuarioUpdate } from '@/types/models'

export function useUsuarioUpdate() {
  const queryCache = useQueryCache()

  return useMutation<UpdateResult, UsuarioUpdate>({
    mutation: ({ id, ...updatedData }) => api.update(id, updatedData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.usuarios.listas() })
      queryCache.cancelQueries({ key: queryKeys.usuarios.detalles() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.usuarios.listas() })
      queryCache.invalidateQueries({ key: queryKeys.usuarios.detalles() })
    }
  })
}
