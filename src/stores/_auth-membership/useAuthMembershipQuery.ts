import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { authMembershipApi as api } from '@/api/auth-membership'
import { ref } from 'vue'

export function useAuthMembershipQuery(id?: number | string) {
  const usuarioId = ref(id)

  const { data, isPending } = useQuery({
    key: () => queryKeys.authMembership.lista({ usuario_id: usuarioId.value }),
    query: () => api.getAll({ usuario_id: usuarioId.value }),
    // staleTime: Infinity
  })

  return {
    groups: data,
    isPending,
    usuarioId
  }
}
