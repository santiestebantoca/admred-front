import axios from './axios'
import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

const useUsers = defineStore('auth-impersonate-users', () => {
  const data_ = ref([])
  const filterBy = ref({})
  watch(filterBy, val => {
    if (isFiltered.value) get(val)
  })
  const data = computed(() => isFiltered.value ? data_.value : null)
  const get = params =>
    axios
      .get('/auth/users', { params })
      .then(res => data_.value = res.data)
      .catch(() => { })
  const isFiltered = computed(() => Boolean(Object.keys(filterBy.value || {}).length))
  return { data, filterBy, isFiltered }
})

const useImpersonate = defineStore('auth-impersonate', () => {
  const users = useUsers()
  const auth = useAuth()
  const post = (user_id = 0) =>
    axios.post(`/auth/impersonate/${user_id}`).then(auth.setAuthUser).catch(() => { })
  return { users, post }
})

const useAuth = defineStore('auth', () => {
  const impersonate = useImpersonate()
  const authUser = ref(null)
  const auth = computed(() => authUser.value === null
    ? null
    : Boolean(authUser.value))
  const login = data =>
    axios
      .post('/auth/login', data)
      .then(({ data }) => {
        authUser.value = data.user
        return data
      })
      .catch(() => { })
  const logout = () =>
    axios.delete('/auth/login').then(setAuthUser).catch(() => { })
  const getAuthUser = () =>
    axios.get('/auth/login').then(setAuthUser).catch(() => { })
  const setAuthUser = ({ data }) => authUser.value = data
  return { auth, authUser, login, logout, getAuthUser, setAuthUser, impersonate }
})

export default useAuth
