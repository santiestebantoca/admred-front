import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { consultadasApi as api } from '@/api/consultadas'
import type { ConsultadaRow, ConsultadasParams } from '@/types/api'
import { computed, ref } from 'vue'

export function useConsultadasQuery() {
  const params = ref<ConsultadasParams>({
    desde: '',
    hasta: '',
  })

  const { data, isPending } = useQuery<ConsultadaRow[]>({
    key: () => queryKeys.consultadas.lista(params.value),
    query: () => api.getAll(params.value),
    enabled: () => Boolean(params.value.desde && params.value.hasta),
  })

  const formatted = computed(() => (data.value || []).map(d => ({ value: d.destino_id, text: d.destino })))

  return {
    destinos: formatted,
    isPending,
    params
  }
}
