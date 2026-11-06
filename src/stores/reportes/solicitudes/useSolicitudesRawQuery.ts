import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { reportesApi as api } from '@/api/reportes'
import { ref } from 'vue'

export const useSolicitudesRawQuery = () => {
  const params = ref({
    desde: undefined,
    hasta: undefined,
    destino_id: undefined
  })

  const { data, isPending, isLoading, refresh } = useQuery({
    key: () => queryKeys.reportes.solicitudes.raw.lista(params.value),
    query: () => api.solicitudes.raw.getAll(params.value),
    enabled: () => Object.values(params.value).every(v => v != null),
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