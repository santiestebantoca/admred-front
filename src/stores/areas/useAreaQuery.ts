import { useQuery } from '@pinia/colada'
import { areasApi as api } from '@/api/areas'
import { queryKeys } from '@/lib/query-keys'
import type { Id } from '@/types/api'
import type { AreaDetalle } from '@/types/models'
import { toValue, type MaybeRefOrGetter } from 'vue'

export function useAreaQuery(areaId?: MaybeRefOrGetter<Id>) {

  const { data, isPending } = useQuery<AreaDetalle>({
    key: () => queryKeys.areas.detalle(toValue(areaId)),
    query: () => api.getById(toValue(areaId)),
    enabled: () => !!toValue(areaId),
  })

  return {
    area: data,
    isPending,
  }
}
