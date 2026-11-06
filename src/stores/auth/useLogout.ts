import { useMutation, useQueryCache } from '@pinia/colada'
import { authApi as api } from '@/api/auth'
import { queryKeys } from '@/lib/query-keys'
import type { AuthUser } from '@/types/api'

export function useLogout() {
  const queryCache = useQueryCache()

  return useMutation<AuthUser | null, void>({
    mutation: api.logout,

    onSuccess: () => {
      queryCache.setQueryData(queryKeys.auth.user(), () => null)
    },
  })
}
