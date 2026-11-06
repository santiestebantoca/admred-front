import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { reportesApi as api } from '@/api/reportes'
import { ref } from 'vue'

export const useSolicitudesInternasQuery = () => {
  const params = ref({
    codigo: undefined,
    desde: undefined,
    hasta: undefined,
    objetivo: undefined,
    origen: undefined,
    estado: undefined
  })

  const { data, isPending, isLoading, refresh } = useQuery({
    key: () => queryKeys.reportes.solicitudes.internas.lista(params.value),
    query: () => api.solicitudes.internas.getAll(params.value),
    enabled: () => params.value.desde && params.value.hasta,
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