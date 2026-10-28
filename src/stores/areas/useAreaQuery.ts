import { useQuery } from '@pinia/colada'
import { areasApi as api } from '@/api/areas'
import { queryKeys } from '@/lib/query-keys'
import { toValue } from 'vue'

export function useAreaQuery(areaId?: number | string) {

  const { data, isPending } = useQuery({
    key: () => queryKeys.areas.detalle(toValue(areaId)),
    query: () => api.getById(toValue(areaId)),
    enabled: () => !!toValue(areaId),
  })

  return {
    area: data,
    isPending,
  }
}
