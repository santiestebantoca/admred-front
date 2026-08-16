// stores/authImpersonate.js
import { useMutation, useQueryCache } from '@pinia/colada'
import { authApi as api } from '@/api/auth'
import { queryKeys } from '@/lib/query-keys'

export function useLogout() {
  const queryCache = useQueryCache()

  return useMutation<any, void>({
    mutation: api.logout,

    onSuccess: (data, variables, context) => {
      queryCache.setQueryData(queryKeys.auth.user(), () => null)
    },
  })
}