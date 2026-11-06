import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { destinosApi as api } from '@/api/destinos'
import type { DestinoOpcion } from '@/types/api'
import { useStorage } from '@vueuse/core'
import { ref, computed } from 'vue'

/** Destino con la búsqueda normalizada que usa el filtro del selector. */
type DestinoBuscable = DestinoOpcion & {
  search: string
  history?: boolean
}

export function useDestinosSelectQuery() {
  const search = ref<string>()

  const { data: _data, isPending } = useQuery<DestinoOpcion[]>({
    key: () => queryKeys.destinos.listas(),
    query: () => api.getAll(),
    staleTime: Infinity
  })

  const data = computed<DestinoBuscable[]>(() => (_data.value || [])
    .map(d => ({ ...d, search: d.nombre.trim().toLowerCase() })))
  const singleOption = computed(() => data.value.length === 1 ? data.value[0] : null)
  const search_ = computed(() => search.value?.trim().toLowerCase())
  const historyIds = useStorage<number[]>('admred_stores_folder_destinos', [])
  const historial = {
    add: (id: number) => {
      historyIds.value = historyIds.value.filter(d => d !== id)
      historyIds.value.unshift(id) // adds id to the start of array
    },
    del: (id: number) => {
      historyIds.value = historyIds.value.filter(d => d !== id)
    }
  }
  const destinos = computed<DestinoBuscable[]>(() => {
    const getHistory = (items: DestinoBuscable[], histIds: number[]) => {
      const history: DestinoBuscable[] = []
      const exclude: number[] = []
      let found: DestinoBuscable | undefined
      histIds.every(id => {
        found = items.find(d => d.id === id)
        found && (found.history = true) && history.push(found) && exclude.push(id)
        return history.length !== 8
      })
      return { history, exclude }
    }
    let history: DestinoBuscable[] = []
    let filtered: DestinoBuscable[] = []
    if (data.value.length > 1) {
      const dataCopy = JSON.parse(JSON.stringify(data.value)) as DestinoBuscable[]
      if (search_.value) {
        const data_ = dataCopy.filter(d => d.search.includes(search_.value!))
        if (data_.length) {
          const res = getHistory(data_, historyIds.value)
          history = res.history
          filtered = data_.filter(d => !res.exclude.includes(d.id))
        }
      } else {
        const res = getHistory(dataCopy, historyIds.value)
        history = res.history
      }
    }
    return [...history, ...filtered]
  })
  return {
    destinos,
    historial,
    singleOption,
    isPending,
    search
  }
}
