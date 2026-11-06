import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { nivelesApi as api } from '@/api/niveles'
import type { NivelesResponse } from '@/types/api'
import { computed } from 'vue'

export function useNivelesQuery() {
  const { data, isPending } = useQuery<NivelesResponse>({
    key: () => queryKeys.niveles.listas(),
    query: () => api.getAll(),
    staleTime: Infinity
  })

  return {
    niveles: data,
    isPending,
    options: computed(() => data.value?.map((d) => ({
      ...d, // Se usan en la lógica del formulario
      value: d.id,
      text: d.nombre,
    })))
  }
}
