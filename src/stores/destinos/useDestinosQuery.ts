import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { destinosApi as api } from '@/api/destinos'
import { /*refDebounced,*/ useStorage } from '@vueuse/core'
import { ref, computed } from 'vue'

export function useDestinosQuery() {
  const search = ref(undefined)
  // const debouncedSearch = refDebounced(search, 600) // 300ms de debounce
  // const limit = ref(undefined) // '0,2' (al inicio traer dos para singleOption)
  // const params = computed(() => ({
  //   search: debouncedSearch.value,
  //   limit: limit.value
  // }))

  const { data: _data, isPending } = useQuery({
    key: () => queryKeys.destinos.listas(),
    query: () => api.getAll(),
    // key: () => queryKeys.destinos.lista(params.value),
    // query: () => api.getAll(params.value),
    // enabled: () => search.value?.length > 1, // Imitando en store legacy
    staleTime: Infinity
  })

  const data = computed(() => (_data.value || [])
    .map(d => ({ ...d, search: d.nombre.trim().toLowerCase() })))
  const singleOption = computed(() => data.value.length === 1 ? data.value[0] : null)
  const search_ = computed(() => search.value?.trim().toLowerCase())
  const historyIds = useStorage('admred_stores_folder_destinos', [])
  const historial = {
    add: id => {
      historyIds.value = historyIds.value.filter(d => d !== id)
      historyIds.value.unshift(id) // adds id to the start of array
    },
    del: id => {
      historyIds.value = historyIds.value.filter(d => d !== id)
    }
  }
  const destinos = computed(() => {
    const getHistory = (data, histIds) => {
      const history = []
      const exclude = []
      let found
      histIds.every(id => {
        found = data.find(d => d.id === id)
        found && (found.history = true) && history.push(found) && exclude.push(id)
        return history.length !== 8
      })
      return { history, exclude }
    }
    let history = []
    let filtered = []
    if (data.value.length > 1) {
      let dataCopy = JSON.parse(JSON.stringify(data.value))
      if (search_.value) {
        const data_ = dataCopy.filter(d => d.search.includes(search_.value))
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