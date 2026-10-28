import { useQuery, defineQuery } from '@pinia/colada'
import { solicitudesApi as api } from '@/api/solicitudes'
import { SolicitudDetalle } from '@/types/models'
import { queryKeys } from '@/lib/query-keys'
import { timeDeltaDH, timeDeltaWDH } from '@/composables/useTimeDelta'
import { computed, toValue } from 'vue'

export function useSolicitudQuery(solicitudId?: number | string) {

  const { data: _data, isPending, isLoading } = useQuery<SolicitudDetalle>({
    key: () => queryKeys.solicitudes.detalle(toValue(solicitudId)),
    query: () => api.getById(toValue(solicitudId)),
    enabled: () => !!toValue(solicitudId),
    placeholderData: (previousData) => previousData,
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
    isLoading
  }
}