import { useQuery } from '@pinia/colada'
import { authApi as api } from '@/api/auth'
import { queryKeys } from '@/lib/query-keys'
import type { AuthUser } from '@/types/api'

export function useAuthQuery() {
  const { data, state, isPending, isLoading, refetch } = useQuery<AuthUser | null>({
    key: () => queryKeys.auth.user(),
    query: api.getCurrentUser,
    staleTime: Infinity,
  })

  return {
    authUser: data,
    isPending,
    isLoading,
    state,
    refetch
  }
}
