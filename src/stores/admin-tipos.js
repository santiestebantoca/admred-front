import axios from './axios'
import usePagination from '../composables/usePagination'
import { ref, computed, watch, nextTick, reactive } from 'vue'
import { defineStore } from 'pinia'

const useTipoStore = defineStore('admin-tipos-tipo', () => {
  const data = ref(null)
  const get = id =>
    axios
      .get(`/admin_tipo/tipo/${id}`)
      .then((res) => data.value = res.data)
      .catch(() => { })
  const post = data => axios.post('/admin_tipo/tipo/', data).catch(() => { })
  const put = ({ id, data }) => axios.put(`/admin_tipo/tipo/${id}`, data).catch(() => { })
  const del = id => axios.delete(`/admin_tipo/tipo/${id}`).catch(() => { })
  return { data, get, post, put, del }
})

const useTiposStore = defineStore('admin-tipos-tipos', () => {
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
      descripcion: d[2],
    }))
    page.total = _data.total
  }
  const get = () => {
    const params = { limit: page.range, ...query.value }
    status.value.loading = true
    return axios
      .get('/admin_tipo/tipo', { params })
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

export default defineStore('admin-tipos', () => {
  const tipo = useTipoStore()
  const tipos = useTiposStore()
  return { tipo, tipos }
})
