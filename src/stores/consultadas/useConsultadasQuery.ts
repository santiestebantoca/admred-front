import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { consultadasApi as api } from '@/api/consultadas'
import { computed, ref } from 'vue'

export function useConsultadasQuery() {
  const params = ref({
    desde: undefined,
    hasta: undefined,
    origen_id: undefined,
    origen_nivel: undefined
  })

  const { data, isPending } = useQuery({
    key: () => queryKeys.consultadas.lista(params.value),
    query: () => api.getAll(params.value),
    enabled: () => params.value.desde && params.value.hasta
  })

  const formatted = computed(() => (data.value || []).map(d => ({ value: d.destino_id, text: d.destino })))

  return {
    destinos: formatted,
    isPending,
    params
  }
}
