import { useQuery } from '@pinia/colada'
import { usuariosApi as api } from '@/api/usuarios'
import { queryKeys } from '@/lib/query-keys'
import type { Id } from '@/types/api'
import type { UsuarioDetalle } from '@/types/models'
import { toValue, type MaybeRefOrGetter } from 'vue'

export function useUsuarioQuery(usuarioId?: MaybeRefOrGetter<Id>) {
  const { data, isPending } = useQuery<UsuarioDetalle>({
    key: () => queryKeys.usuarios.detalle(toValue(usuarioId)),
    query: () => api.getById(toValue(usuarioId)),
    enabled: () => !!toValue(usuarioId),
  })

  return {
    usuario: data,
    isPending,
  }
}
