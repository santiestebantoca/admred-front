import { useQuery } from '@pinia/colada'
import { solicitudesApi as api } from '@/api/solicitudes'
import type { SolicitudDetalle } from '@/types/models'
import type { Id } from '@/types/api'
import { queryKeys } from '@/lib/query-keys'
import { timeDeltaDH, timeDeltaWDH } from '@/composables/useTimeDelta'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

/** Detalle de la solicitud más los tiempos calculados en el frontend. */
export type SolicitudConTiempos = SolicitudDetalle & {
  acumulado: string
  laborable: string
  root: boolean
}

export function useSolicitudQuery(solicitudId?: MaybeRefOrGetter<Id>) {

  const { data: _data, isPending, isLoading } = useQuery<SolicitudDetalle>({
    key: () => queryKeys.solicitudes.detalle(toValue(solicitudId)),
    query: () => api.getById(toValue(solicitudId)),
    enabled: () => !!toValue(solicitudId),
    placeholderData: (previousData) => previousData,
  })

  const data = computed<SolicitudConTiempos | undefined>(() => {
    if (!_data.value) return undefined
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
