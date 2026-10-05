import { useQuery } from '@pinia/colada'
import { gruposApi as api } from '@/api/grupos'
import { queryKeys } from '@/lib/query-keys'
import { ref, computed } from 'vue'

export function useGrupoQuery(id?: number | string) {
  const grupoId = ref(id)

  const { data, isPending } = useQuery({
    key: () => queryKeys.grupos.detalle(grupoId.value),
    query: () => api.getById(grupoId.value),
    enabled: () => !!grupoId.value,
    // staleTime: Infinity
  })

  return {
    grupo: data,
    isPending,
    grupoId
  }
}
