import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { authMembershipApi as api } from '@/api/auth-membership'

export function useAuthMembershipUpdate() {
  const queryCache = useQueryCache()

  return useMutation<unknown, { id: number | string }>({
    mutation: ({ id, ...updatedData }) => api.update(id, updatedData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.authMembership.listas() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.authMembership.listas() })
    }
  })
}