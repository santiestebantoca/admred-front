import { useQuery } from '@pinia/colada'
import { tiposApi as api } from '@/api/tipos'
import { queryKeys } from '@/lib/query-keys'
import { ref } from 'vue'

export function useTipoQuery(id?: number | string) {
  const tipoId = ref(id)

  const { data, isPending } = useQuery({
    key: () => queryKeys.tipos.detalle(tipoId.value),
    query: () => api.getById(tipoId.value),
    enabled: () => !!tipoId.value,
    // staleTime: Infinity
  })

  return {
    tipo: data,
    isPending,
    tipoId
  }
}
