import { useQuery } from '@pinia/colada'
import { tiposApi as api } from '@/api/tipos'
import { queryKeys } from '@/lib/query-keys'
import { toValue } from 'vue'

export function useTipoQuery(tipoId?: number | string) {

  const { data, isPending } = useQuery({
    key: () => queryKeys.tipos.detalle(toValue(tipoId)),
    query: () => api.getById(toValue(tipoId)),
    enabled: () => !!toValue(tipoId),
    // staleTime: Infinity
  })

  return {
    tipo: data,
    isPending,
  }
}
