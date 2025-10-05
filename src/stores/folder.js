import axios from './axios'
import usePagination from '../use/usePagination'
import { sortAlphabetical } from '../use/useSort'
import { defineStore } from 'pinia'
import { tidy } from '@tidyjs/tidy'
import { orderByObject } from './tidy-aux'
import { useStorage } from '@vueuse/core'
import { ref, computed, watch, nextTick, reactive } from 'vue'

const usePending = defineStore('folder-pending', () => {
  const data = ref({})
  const setData = data_ => {
    data.value = {
      ...data_,
      sum: data_.incoming + data_.outgoing,
      tasks: data_.assign.length + data_.reply.length + data_.approve.length
    }
  }
  const get = () =>
    axios
      .get('/folder/pending')
      .then((res) => setData(res.data))
      .catch(() => { })
  return { data, get }
})
const useDestinos = defineStore('folder-destinos', () => {
  const state = ref(null)
  const search = ref(null)
  const data = ref([])
  const get = () => {
    if (!state.value) {
      state.value = 1
      axios
        .get('/folder/destinos')
        .then(res => setData(res.data))
        .catch(() => { })
    }
  }
  const setData = _data => {
    data.value = _data.map(d => ({ ...d, search: d.nombre.trim().toLowerCase() }))
  }
  // Layer for single option logic
  const singleOption = computed(() => data.value.length === 1 ? data.value[0] : null)
  // Layer for history + searched + full coincidence
  const search_ = computed(() => search.value?.trim().toLowerCase())
  const historyIds = useStorage('admred_stores_folder_destinos', [])
  const history = {
    add: id => {
      historyIds.value = historyIds.value.filter(d => d !== id)
      historyIds.value.unshift(id) // adds id to the start of array
    },
    del: id => {
      historyIds.value = historyIds.value.filter(d => d !== id)
    }
  }
  const widget = computed(() => {
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
  return { get, search, widget, history, singleOption }
})
const useTramitadores = defineStore('folder-tramitadores', () => {
  const state = ref(null)
  const data = ref([])
  const get = () => {
    if (!state.value) {
      state.value = 1
      axios
        .get('/folder/tramitadores')
        .then((res) => data.value = sortAlphabetical(res.data))
        .catch(() => { })
    }
  }
  return { data, get }
})
const useTipos = defineStore('folder-tipos', () => {
  const state = ref(null)
  const data = ref(null)
  const get = () => {
    if (!state.value) {
      state.value = 1
      axios
        .get('/folder/tipos')
        .then((res) => data.value = res.data)
        .catch(() => { })
    }
  }
  return { data, get }
})

export default defineStore('folder', () => {
  // Server side pagination & filtering // ordering in client
  const pending = usePending()
  // for inputs data
  const destinos = useDestinos()
  const tramitadores = useTramitadores()
  const tipos = useTipos()
  //
  const status = ref({
    loaded: false,
    loading: false,
    resetting: false,
    updated: false,
  })
  const data_ = ref([]) // It uses a computed `data` due to client ordering 
  const query = ref({})
  const page = reactive(usePagination())
  const searchByDefault = { search: null, headers: [] }
  const searchBy = ref({ ...searchByDefault })
  const filterBy = ref({})
  const orderByDefault = { field: null, direction: 'asc' }
  const orderBy = ref({ ...orderByDefault })
  const data = computed(() => tidy(data_.value, ...orderByObject(orderBy.value)))
  const get = () => {
    // const params = { limit: page.range, ...query.value }
    const search = searchBy.value.search ? searchBy.value : {}
    const params = { ...query.value, ...search }
    status.value.loading = true
    return axios
      .get('/folder/solicitud', { params })
      .then(res => {
        setData(res.data)
        status.value.loaded = true
        status.value.updated = Date.now()
      })
      .catch(() => { })
      .finally(() => status.value.loading = false)
  }
  const setData = _data => {
    if (query.value.tray === 'recibidas') {
      data_.value = _data.data.map(d => ({
        id: d[0],
        codigo: d[1],
        objetivo: d[2],
        estado: d[3],
        solicitado_en: d[4],
        terminado_en: d[5],
        origen: d[6],
        root: !d[7]
      }))
    } else { // enviadas
      data_.value = _data.data.map(d => ({
        id: d[0],
        codigo: d[1],
        objetivo: d[2],
        estado: d[3],
        solicitado_en: d[4],
        terminado_en: d[5],
        destino: d[6],
      }))
    }
    page.total = _data.total
  }
  watch(query, () => {
    if (status.value.resetting) return
    // page.first()
    searchBy.value.search = null // searchBy.value = { ...searchByDefault }
    orderBy.value = { ...orderByDefault }
    get()
  })
  const $reset = () => {
    status.value.resetting = true
    // query.value = {}
    data_.value = []
    // page.first()
    // searchBy.value = { ...searchByDefault }
    // orderBy.value = { ...orderByDefault }
    nextTick(() => status.value.resetting = false) // otherwise, resetting is false in query watcher
  }
  return { data, page, get, status, query, orderBy, filterBy, searchBy, $reset, pending, destinos, tramitadores, tipos }
})
