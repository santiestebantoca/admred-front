import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { tiposApi as api } from '@/api/tipos'
import { ref } from 'vue'

export function useTiposQuery() {
  const search = ref(undefined)

  const { data, isPending } = useQuery({
    key: () => queryKeys.tipos.lista({ search: search.value }),
    query: () => api.getAll({ search: search.value }),
    staleTime: Infinity
  })

  return {
    tipos: data,
    isPending,
    search
  }
}