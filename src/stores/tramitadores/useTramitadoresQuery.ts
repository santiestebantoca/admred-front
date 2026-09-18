import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { tramitadoresApi as api } from '@/api/tramitadores'
import { ref } from 'vue'

export function useTramitadoresQuery() {
  const search = ref(undefined)

  const { data, isPending } = useQuery({
    key: () => queryKeys.tramitadores.lista({ search: search.value }),
    query: () => api.getAll({ search: search.value }),
    staleTime: Infinity
  })

  return {
    tramitadores: data,
    isPending,
    search
  }
}