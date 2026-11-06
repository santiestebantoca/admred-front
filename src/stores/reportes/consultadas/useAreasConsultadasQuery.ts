import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { reportesApi as api } from '@/api/reportes'
import type {
  ReporteAreaConsultadaRow,
  ReportesAreasConsultadasParams,
} from '@/types/api'
import { tidy, mutate, groupBy, summarize, mean } from '@tidyjs/tidy'
import { timeDeltaW, timeDeltaWToDH } from '@/composables/useTimeDelta'
import { ref, computed } from 'vue'

export const useAreasConsultadasQuery = () => {
  const params = ref<ReportesAreasConsultadasParams>({
    desde: '',
    hasta: '',
  })

  const { data: _data, isPending, isLoading, refresh } = useQuery<ReporteAreaConsultadaRow[]>({
    key: () => queryKeys.reportes.consultadas.lista(params.value),
    query: () => api.consultadas.getAll(params.value),
    enabled: () => Boolean(params.value.desde && params.value.hasta),
    // Al cambiar los filtros se conserva el reporte anterior hasta que llega el
    // nuevo: así no desaparecen los resultados ni salta el layout.
    placeholderData: (previousData) => previousData,
  })

  const data = computed(() => {
    if (!_data.value || !_data.value.length) return _data.value
    const datoConDemora = tidy(
      _data.value,
      mutate({
        demora: d => timeDeltaW(d.solicitado_en, d.terminado_en),
      })
    )
    const datoAgrupado = tidy(
      datoConDemora,
      groupBy('destino', [
        summarize({
          presentadas: items => items?.length,
          terminadas: items => items?.filter(item => item.terminado_en).length,
          demora: mean('demora')
        })
      ]),
      mutate({
        efectividad: d => Math.round(d.terminadas / d.presentadas * 100 * 10) / 10,
        demoraH: d => Math.trunc(d.demora / 60),
        demoraDH: d => timeDeltaWToDH(d.demora)
      })
    )
    const datoSumarizado = tidy(
      datoConDemora,
      summarize({
        presentadas: items => items?.length,
        terminadas: items => items?.filter(item => item.terminado_en).length,
        demora: mean('demora')
      }),
      mutate({
        destino: 'Sub total',
        efectividad: d => Math.round(d.terminadas / d.presentadas * 100 * 10) / 10,
        demoraH: d => Math.trunc(d.demora / 60),
        demoraDH: d => timeDeltaWToDH(d.demora)
      })
    )
    return datoAgrupado.concat(datoSumarizado)
  })

  return {
    areas: data,
    isPending,
    isLoading,
    refresh,
    params
  }
}
