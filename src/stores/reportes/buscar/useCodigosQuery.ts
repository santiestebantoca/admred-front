import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { reportesApi as api } from '@/api/reportes'
import type { ReporteCodigoRow } from '@/types/api'
import { ref } from 'vue'

export const useCodigosQuery = () => {
  const codigo = ref<string>()

  const { data, isPending, isLoading, refresh } = useQuery<ReporteCodigoRow[]>({
    key: () => queryKeys.reportes.codigos.lista({ codigo: codigo.value }),
    query: () => api.codigos.getAll({ codigo: codigo.value }),
    enabled: () => !!codigo.value,
    // Al buscar otro código se conservan los resultados anteriores hasta que
    // llega la nueva búsqueda.
    placeholderData: (previousData) => previousData,
  })

  return {
    solicitudes: data,
    codigo,
    isPending,
    isLoading,
    refresh,
  }
}
