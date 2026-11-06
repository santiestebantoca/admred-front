import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { demandantesApi as api } from '@/api/demandantes'
import type { DemandanteRow, DemandantesParams } from '@/types/api'
import { computed, ref } from 'vue'

export function useDemandantesQuery() {
  const params = ref<DemandantesParams>({
    desde: '',
    hasta: '',
  })

  const { data, isPending } = useQuery<DemandanteRow[]>({
    key: () => queryKeys.demandantes.lista(params.value),
    query: () => api.getAll(params.value),
    enabled: () => Boolean(params.value.desde && params.value.hasta),
  })

  const formatted = computed(() => (data.value || []).map(d => ({ value: d.origen_id, text: d.origen })))

  return {
    origenes: formatted,
    isPending,
    params
  }
}
