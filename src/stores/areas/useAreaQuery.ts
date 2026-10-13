import { useQuery } from '@pinia/colada'
import { areasApi as api } from '@/api/areas'
import { queryKeys } from '@/lib/query-keys'
import { ref } from 'vue'

export function useAreaQuery(id?: number | string) {
  const areaId = ref(id)

  const { data, isPending } = useQuery({
    key: () => queryKeys.areas.detalle(areaId.value),
    query: () => api.getById(areaId.value),
    enabled: () => !!areaId.value,
    // staleTime: Infinity
  })

  return {
    area: data,
    isPending,
    areaId
  }
}
