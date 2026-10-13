import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { nivelesApi as api } from '@/api/niveles'

export function useNivelesQuery() {
  const { data, isPending } = useQuery({
    key: () => queryKeys.niveles.listas(),
    query: () => api.getAll(),
    staleTime: Infinity
  })

  return {
    niveles: data,
    isPending,
  }
}
