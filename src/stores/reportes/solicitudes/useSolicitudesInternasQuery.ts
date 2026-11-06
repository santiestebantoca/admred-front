import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { reportesApi as api } from '@/api/reportes'
import type {
  ReporteSolicitudRow,
  ReportesSolicitudesInternasParams,
} from '@/types/api'
import { ref } from 'vue'

export const useSolicitudesInternasQuery = () => {
  const params = ref<ReportesSolicitudesInternasParams>({
    desde: '',
    hasta: '',
  })

  const { data, isPending, isLoading, refresh } = useQuery<ReporteSolicitudRow[]>({
    key: () => queryKeys.reportes.solicitudes.internas.lista(params.value),
    query: () => api.solicitudes.internas.getAll(params.value),
    enabled: () => Boolean(params.value.desde && params.value.hasta),
    // Al cambiar los filtros se conserva el reporte anterior hasta que llega el
    // nuevo: así no desaparecen los resultados ni salta el layout.
    placeholderData: (previousData) => previousData,
  })

  return {
    solicitudes: data,
    isPending,
    isLoading,
    refresh,
    params
  }
}
