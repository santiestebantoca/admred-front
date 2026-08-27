import axios from './axios'
import usePagination from '../composables/usePagination'
import { sortAlphabetical } from '../composables/useSort'
import { ref, computed, watch, nextTick, reactive } from 'vue'
import { defineStore } from 'pinia'

const useAreaStore = defineStore('admin-areas-area', () => {
  const data = ref(null)
  const get = id =>
    axios
      .get(`/admin_area/area/${id}`)
      .then((res) => data.value = res.data)
      .catch(() => { })
  const post = data => axios.post('/admin_area/area/', data).catch(() => { })
  const put = ({ id, data }) => axios.put(`/admin_area/area/${id}`, data).catch(() => { })
  const del = id => axios.delete(`/admin_area/area/${id}`).catch(() => { })
  return { data, get, put, post, del }
})

const useAreasStore = defineStore('admin-areas-areas', () => {
  // Server side pagination & filtering // ordering not implemented!
  const status = ref({
    loaded: false,
    loading: false,
    resetting: false,
    updated: false,
  })
  const data = ref([])
  const query = ref({})
  const page = reactive(usePagination())
  const setData = _data => {
    data.value = _data.data.map(d => ({
      id: d[0],
      nombre: d[1],
      padre: d[2],
      nivel: d[3],
      rol_key: d[4],
    }))
    page.total = _data.total
  }
  const get = () => {
    const params = { limit: page.range, ...query.value }
    status.value.loading = true
    return axios
      .get('/admin_area/area', { params })
      .then(res => {
        setData(res.data)
        status.value.loaded = true
        // status.value.updated = Date.now()
      })
      .catch(() => { })
      .finally(() => status.value.loading = false)
  }
  watch(query, () => {
    if (status.value.resetting) return
    page.first()
    get()
  })
  const $reset = () => {
    status.value.resetting = true
    query.value = {}
    data.value = []
    page.first()
    nextTick(() => status.value.resetting = false) // otherwise, resetting is false in query watcher
  }
  const isFiltered = computed(() => Object.keys(query.value).length)
  return { data, page, get, status, query, isFiltered, $reset }
})

// Static
const useNivelesStore = defineStore('admin-areas-niveles', () => {
  const data = ref(null)
  const get = () =>
    !data.value && axios
      .get('/admin_area/niveles')
      .then(res => data.value = sortAlphabetical(res.data))
      .catch(() => { })
  return { data, get }
})

const usePadresStore = defineStore('admin-areas-padres', () => {
  const status = ref({
    loaded: null,
    loading: null,
    resetting: false,
    updated: false,
  })
  const data = ref([])
  const query = ref({})
  const setData = _data => {
    data.value = sortAlphabetical(_data.map(d => ({
      id: d[0],
      nombre: d[1],
    })))

  }
  const get = () => {
    const params = { ...query.value }
    status.value.loading = true
    return axios
      .get('/admin_area/padres', { params })
      .then(res => {
        setData(res.data)
        status.value.loaded = true
        // status.value.updated = Date.now()
      })
      .catch(() => { })
      .finally(() => status.value.loading = false)
  }
  watch(query, () => {
    if (status.value.resetting) return
    get()
  })
  const $reset = () => {
    status.value.resetting = true
    query.value = {}
    data.value = []
    page.first()
    nextTick(() => status.value.resetting = false) // otherwise, resetting is false in query watcher
  }
  return { data, get, status, query, $reset }
})

export default defineStore('admin-areas', () => {
  const area = useAreaStore()
  const areas = useAreasStore()
  const niveles = useNivelesStore()
  const padres = usePadresStore()
  return { area, areas, niveles, padres }
})
