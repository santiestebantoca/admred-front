import { useQuery, defineQuery } from '@pinia/colada'
import { solicitudesApi as api } from '@/api/solicitudes'
import { queryKeys } from '@/lib/query-keys'
import { timeDeltaDH, timeDeltaWDH } from '@/composables/useTimeDelta'
import { computed, ref } from 'vue'

export const useSolicitudQuery = defineQuery((id?: number | string) => {
  const solicitudId = ref(id)

  const { data: _data, isPending, isLoading } = useQuery({
    key: () => queryKeys.solicitudes.detalle(solicitudId.value),
    query: () => api.getById(solicitudId.value),
    enabled: () => !!solicitudId.value,
    staleTime: Infinity
  })

  const data = computed(() => {
    if (!_data.value) return _data.value
    return {
      ..._data.value,
      acumulado: timeDeltaDH(_data.value.solicitado_en, _data.value.terminado_en),
      laborable: timeDeltaWDH(_data.value.solicitado_en, _data.value.terminado_en),
      root: !_data.value.padre
    }
  })

  return {
    solicitud: data,
    isPending,
    isLoading,
    solicitudId
  }
})