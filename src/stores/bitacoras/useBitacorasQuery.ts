import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { bitacorasApi as api } from '@/api/bitacoras'
import { toValue } from 'vue'

export function useBitacorasQuery(solicitudId?: number | string) {

  const { data, isPending } = useQuery({
    key: () => queryKeys.bitacoras.lista({ solicitudId: toValue(solicitudId) }),
    query: () => api.getAll({ solicitudId: toValue(solicitudId) }),
    enabled: () => !!toValue(solicitudId),
    // staleTime: Infinity
  })

  return {
    registros: data,
    isPending,
  }
}
