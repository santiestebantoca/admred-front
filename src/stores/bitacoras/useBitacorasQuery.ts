import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { bitacorasApi as api } from '@/api/bitacoras'
import { ref } from 'vue'

export function useBitacorasQuery(_solicitudId?: number | string) {
  const solicitudId = ref(_solicitudId)

  const { data, isPending } = useQuery({
    key: () => queryKeys.bitacoras.lista({ solicitudId: solicitudId.value }),
    query: () => api.getAll({ solicitudId: solicitudId.value }),
    enabled: () => !!solicitudId.value,
    staleTime: Infinity
  })

  return {
    registros: data,
    isPending,
    solicitudId
  }
}
