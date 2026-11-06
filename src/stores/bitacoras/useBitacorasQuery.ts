import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { bitacorasApi as api } from '@/api/bitacoras'
import type { Id } from '@/types/api'
import type { BitacoraDetalle } from '@/types/models'
import { toValue } from 'vue'

export function useBitacorasQuery(solicitudId?: Id) {

  const { data, isPending } = useQuery<BitacoraDetalle[]>({
    key: () => queryKeys.bitacoras.lista({ solicitudId: toValue(solicitudId) }),
    query: () => api.getAll({ solicitudId: toValue(solicitudId) }),
    enabled: () => !!toValue(solicitudId),
  })

  return {
    registros: data,
    isPending,
  }
}
