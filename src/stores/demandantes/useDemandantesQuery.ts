import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { demandantesApi as api } from '@/api/demandantes'
import { computed, ref } from 'vue'

export function useDemandantesQuery() {
  const params = ref({
    desde: undefined,
    hasta: undefined,
    destino_id: undefined,
    origen_niveles: undefined
  })

  const { data, isPending } = useQuery({
    key: () => queryKeys.demandantes.lista(params.value),
    query: () => api.getAll(params.value),
    enabled: () => Object.values(params.value).every(v => v != null),
  })

  const formatted = computed(() => (data.value || []).map(d => ({ value: d.origen_id, text: d.origen })))

  return {
    origenes: formatted,
    isPending,
    params
  }
}
