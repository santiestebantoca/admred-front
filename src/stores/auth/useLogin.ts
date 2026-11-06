import { useMutation, useQueryCache } from '@pinia/colada'
import { authApi as api } from '@/api/auth'
import { queryKeys } from '@/lib/query-keys'
import type { AuthUser } from '@/types/api'
import type { LoginCredentials } from '@/types/models'

export function useLogin() {
  const queryCache = useQueryCache()

  return useMutation<AuthUser, LoginCredentials>({
    mutation: (credentials) => api.login(credentials),

    onSuccess: (data) => {
      queryCache.setQueryData(queryKeys.auth.user(), () => data)
    }
  })
}
