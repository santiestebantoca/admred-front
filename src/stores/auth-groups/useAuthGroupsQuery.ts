import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { authGroupsApi as api } from '@/api/auth-groups'
import type { AuthGroupsResponse } from '@/types/api'

export function useAuthGroupsQuery() {
  const { data, isPending } = useQuery<AuthGroupsResponse>({
    key: queryKeys.authGroups.listas(),
    query: () => api.getAll(),
    staleTime: Infinity
  })

  return {
    groups: data,
    isPending,
  }
}
