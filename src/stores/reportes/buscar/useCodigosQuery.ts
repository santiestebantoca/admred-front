import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { reportesApi as api } from '@/api/reportes'
import { ref } from 'vue'

export const useCodigosQuery = () => {
  const codigo = ref(undefined)

  const { data, isPending, isLoading, refresh } = useQuery({
    key: () => queryKeys.reportes.codigos.lista({ codigo: codigo.value }),
    query: () => api.codigos.getAll({ codigo: codigo.value }),
    enabled: () => codigo.value
  })

  return {
    solicitudes: data,
    codigo,
    isPending,
    isLoading,
    refresh,
  }
}
