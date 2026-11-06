import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { notasApi as api } from '@/api/notas'
import type { NotaCreate } from '@/types/models'

export function useNotaCreate() {
  const queryCache = useQueryCache()

  return useMutation<number, NotaCreate>({
    mutation: (newData) => api.create(newData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.notas.listas() })
      queryCache.cancelQueries({ key: queryKeys.solicitudes.detalles() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.notas.listas() })
      queryCache.invalidateQueries({ key: queryKeys.solicitudes.detalles() })
    }
  })
}
