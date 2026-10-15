import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { authGroupsApi as api } from '@/api/auth-groups'

export function useAuthGroupsQuery() {
  const { data, isPending } = useQuery({
    key: queryKeys.authGroups.listas(),
    query: () => api.getAll(),
    staleTime: Infinity
  })

  return {
    groups: data,
    isPending,
  }
}