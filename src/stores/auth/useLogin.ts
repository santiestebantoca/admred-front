// stores/authImpersonate.js
import { useMutation, useQueryCache } from '@pinia/colada'
import { authApi as api } from '@/api/auth'
import { queryKeys } from '@/lib/query-keys'
import type { LoginCredentials } from '@/types/models'

export function useLogin() {
  const queryCache = useQueryCache()

  return useMutation<any, LoginCredentials>({
    mutation: (credentials) => api.login(credentials),

    onSuccess: (data, variables, context) => {
      queryCache.setQueryData(queryKeys.auth.user(), () => data)
    }
  })
}