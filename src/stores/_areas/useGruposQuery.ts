import { useQuery } from '@pinia/colada'
import { flatToTree } from '@/utils'
import { queryKeys } from '@/lib/query-keys'
import { gruposApi as api } from '@/api/grupos'
import { ref, computed } from 'vue'

export function useGruposQuery() {
  const { data, isPending } = useQuery({
    key: queryKeys.grupos.listas(),
    query: () => api.getAll(),
  })

  const tree = computed(() => {
    if (!data.value) return []
    return flatToTree(data.value, { parentKey: 'pertenece' })
  })

  return {
    grupos: tree,
    isPending,
  }
}

export function useGruposDelGrupoQuery(id?: number | string) {
  const padreId = ref(id)

  const { data, isPending } = useQuery({
    key: () => queryKeys.grupos.lista({ pertenece: padreId.value }),
    query: () => api.getAll({ pertenece: padreId.value }),
    // staleTime: Infinity
  })

  return {
    grupos: data,
    isPending,
    padreId
  }
}

export function useGruposNotificablesQuery() {
  const { data, isPending } = useQuery({
    key: queryKeys.grupos.lista({ label: 'grupo,centro' }),
    query: () => api.getAll({ label: 'grupo,centro' }),
  })

  const tree = computed(() => {
    if (!data.value) return []
    return flatToTree(data.value, { parentKey: 'pertenece' })
  })

  return {
    data,
    grupos: tree,
    isPending,
  }
}

export function useGruposOrigenesQuery() {
  const { data, isPending } = useQuery({
    key: queryKeys.grupos.lista({ label: 'centro,origen' }),
    query: () => api.getAll({ label: 'centro,origen' }),
  })

  const tree = computed(() => {
    if (!data.value) return []
    return flatToTree(data.value, { parentKey: 'pertenece' })
  })

  return {
    grupos: tree,
    isPending,
  }
}
