// stores/authImpersonate.js
import { useQuery } from '@pinia/colada'
import { authApi as api } from '@/api/auth'
import { queryKeys } from '@/lib/query-keys'

export function useAuthQuery() {
  const { data, state, isPending, isLoading, refetch } = useQuery({
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