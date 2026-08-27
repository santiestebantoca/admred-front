import axios from './axios'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { timeDeltaDH, timeDeltaWDH } from '@/composables/useTimeDelta'

const useRecord = defineStore('item-record', () => {
  const data = ref(null)
  const get = solicitud =>
    axios
      .get('/folder/bitacora', { params: { solicitud } })
      .then((res) => data.value = res.data)
      .catch(() => data.value = null)
  const reset = () => data.value = null
  return { data, get, reset }
})
const useNote = defineStore('item-note', () => {
  const data = ref(null)
  const cache = ref(null)
  const get = solicitud => {
    if (solicitud) cache.value = solicitud
    else solicitud = cache.value
    return axios
      .get('/folder/nota', { params: { solicitud } })
      .then((res) => data.value = res.data)
      .catch(() => data.value = null)
  }
  const post = data => axios.post('/folder/nota', data).catch(() => { })
  const reset = () => data.value = null
  return { data, get, post, reset }
})
export default defineStore('item', () => {
  const record = useRecord()
  const note = useNote()
  const data = ref(null)
  const cache = ref(null)
  function setData(_data) {
    if (_data)
      data.value = {
        ..._data,
        acumulado: timeDeltaDH(_data.solicitado_en, _data.terminado_en),
        laborable: timeDeltaWDH(_data.solicitado_en, _data.terminado_en),
        root: !_data.padre
      }
    else data.value = data
  }
  const reset = () => data.value = record.data = note.data = null
  const get = (id) => {
    if (id) cache.value = id
    else id = cache.value
    return axios
      .get(`/folder/solicitud/${id}`)
      .then((res) => setData(res.data))
      .catch(() => setData(null))
  }
  const post = data => axios.post('/folder/solicitud', data).catch(() => { })
  const put = ({ id, data }) => axios.put(`/folder/solicitud/${id}`, data).catch(() => { })
  return { data, get, reset, post, put, record, note }
})
