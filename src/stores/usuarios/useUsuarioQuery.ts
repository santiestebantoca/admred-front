import { useQuery } from '@pinia/colada'
import { usuariosApi as api } from '@/api/usuarios'
import { queryKeys } from '@/lib/query-keys'
import { ref } from 'vue'

export function useUsuarioQuery(id?: number | string) {
  const usuarioId = ref(id)

  const { data, isPending } = useQuery({
    key: () => queryKeys.usuarios.detalle(usuarioId.value),
    query: () => api.getById(usuarioId.value),
    enabled: () => !!usuarioId.value,
    // staleTime: Infinity
  })

  return {
    usuario: data,
    isPending,
    usuarioId
  }
}
