import axios from './axios'
import usePagination from '../use/usePagination'
import { sortAlphabetical } from '../use/useSort'
import { ref, computed, watch, nextTick, reactive } from 'vue'
import { defineStore } from 'pinia'

const useMembership = defineStore('admin-users-user-membership', () => {
  const post = params => axios.post('/admin_user/membership', params).catch(() => { })
  const del = params => axios.delete('/admin_user/membership', { data: params }).catch(() => { })
  return { post, del }
})

const useUserStore = defineStore('admin-users-user', () => {
  const membership = useMembership()
  const data = ref(null)
  const setData = _data => {
    data.value = _data ? {
      ..._data,
      blocked: _data.registration_key === 'blocked'
    } : res.data
  }
  const get = id =>
    axios
      .get(`/admin_user/user/${id}`)
      .then(res => setData(res.data))
      .catch(() => { })
  const post = data => axios.post('/admin_user/user/', data).catch(() => { })
  const put = ({ id, data }) => axios.put(`/admin_user/user/${id}`, data).catch(() => { })
  const del = id => axios.delete(`/admin_user/user/${id}`).catch(() => { })
  return { data, get, post, put, del, membership }
})

const useUsersStore = defineStore('admin-users-users', () => {
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
      name: d[1],
      username: d[2],
      blocked: d[3] === 'blocked',
    }))
    page.total = _data.total
  }
  const get = () => {
    const params = { limit: page.range, ...query.value }
    status.value.loading = true
    return axios
      .get(`/admin_user/user`, { params })
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
const useAreasStore = defineStore('admin-users-areas', () => {
  const data = ref(null)
  const get = () =>
    !data.value && axios
      .get('/admin_user/areas')
      .then(res => data.value = sortAlphabetical(res.data))
      .catch(() => { })
  return { data, get }
})

// Static
const useAuthgroupStore = defineStore('admin-users-authgroup', () => {
  const data = ref(null)
  const get = () =>
    axios
      .get('/admin_user/authgroup')
      .then(res => data.value = sortAlphabetical(res.data))
      .catch(() => { })
  return { get, data }
})

export default defineStore('admin-users', () => {
  const user = useUserStore()
  const users = useUsersStore()
  const areas = useAreasStore()
  const authgroup = useAuthgroupStore()
  return { user, users, areas, authgroup }
})
