import { useQuery } from '@pinia/colada'
import { usuariosApi as api } from '@/api/usuarios'
import { queryKeys } from '@/lib/query-keys'
import { toValue } from 'vue'

export function useUsuarioQuery(id) {
  const { data, isPending } = useQuery({
    key: () => queryKeys.usuarios.detalle(toValue(id)),
    query: () => api.getById(toValue(id)),
    enabled: () => toValue(id),
    // staleTime: Infinity
  })

  return {
    usuario: data,
    isPending,
  }
}
