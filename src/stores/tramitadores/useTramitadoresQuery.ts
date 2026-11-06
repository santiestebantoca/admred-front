import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { tramitadoresApi as api } from '@/api/tramitadores'
import type { TramitadorOpcion } from '@/types/api'
import { ref, computed } from 'vue'

export function useTramitadoresQuery() {
  const search = ref<string>()

  const { data, isPending } = useQuery<TramitadorOpcion[]>({
    key: () => queryKeys.tramitadores.lista({ search: search.value }),
    query: () => api.getAll({ search: search.value }),
    staleTime: Infinity
  })

  return {
    tramitadores: data,
    isPending,
    search,
    options: computed(() => data.value?.map((d) => ({
      value: d.id,
      text: d.name
    })))
  }
}
