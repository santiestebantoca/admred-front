import axios from './axios'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { tidy, mutate, groupBy, summarize, mean } from '@tidyjs/tidy'
import { sortAlphabetical } from '../composables/useSort'
import { timeDeltaW, timeDeltaWToDH } from '@/composables/useTimeDelta'

const useExternasAreas = defineStore('report-externas-areas', () => {
  const data = ref(null)
  function get() {
    axios
      .get('/report/areas?nivel=4')
      .then(res => data.value = sortAlphabetical(res.data))
      .catch(() => { })
  }
  return { data, get }
})
const useExternas = defineStore('report-externas', () => {
  const areas = useExternasAreas()
  const data = ref(null)
  const count = ref(null)
  const loading = ref(false)
  function get(params) {
    loading.value = true
    axios
      .get('/report/externas', { params })
      .then(res => setData(res.data))
      .catch(() => { })
      .finally(() => loading.value = false)
  }
  function setData(data_) {
    data.value = data_
    count.value = data_?.length
  }
  const reset = () => data.value = null
  const noData = computed(() => !loading.value && !count.value)
  return { data, areas, get, reset, loading, noData }
})
const useInternasAreas = defineStore('report-internas-areas', () => {
  const data = ref(null)
  function get() {
    axios
      .get('/report/areas')
      .then(res => data.value = sortAlphabetical(res.data))
      .catch(() => { })
  }
  return { data, get }
})
const useInternas = defineStore('report-internas', () => {
  const areas = useInternasAreas()
  const data = ref(null)
  const count = ref(null)
  const loading = ref(false)
  function get(params) {
    loading.value = true
    axios
      .get('/report/internas', { params })
      .then(res => setData(res.data))
      .catch(() => { })
      .finally(() => loading.value = false)
  }
  function setData(data_) {
    data.value = data_
    count.value = data_?.length
  }
  const reset = () => data.value = null
  const noData = computed(() => !loading.value && !count.value)
  return { data, areas, get, reset, loading, noData }
})
const useConsultadas = defineStore('report-consultadas', () => {
  const data = ref(null)
  const count = ref(null)
  const summary = ref(null)
  const loading = ref(false)
  function setData(_data) {
    count.value = _data?.length
    const dataWithDemora = tidy(
      _data,
      mutate({
        demora: d => timeDeltaW(d.solicitado_en, d.terminado_en),
      })
    )
    data.value = tidy(
      dataWithDemora,
      groupBy('destino', [
        summarize({
          presentadas: items => items?.length,
          terminadas: items => items?.filter(item => item.terminado_en).length,
          demora: mean('demora')
        })
      ]),
      mutate({
        efectividad: d => Math.round(d.terminadas / d.presentadas * 100 * 10) / 10,
        demoraH: d => Math.trunc(d.demora / 60),
        demoraDH: d => timeDeltaWToDH(d.demora)
      })
    )
    summary.value = tidy(
      dataWithDemora,
      summarize({
        presentadas: items => items?.length,
        terminadas: items => items?.filter(item => item.terminado_en).length,
        demora: mean('demora')
      }),
      mutate({
        destino: 'Sub total',
        efectividad: d => Math.round(d.terminadas / d.presentadas * 100 * 10) / 10,
        demoraH: d => Math.trunc(d.demora / 60),
        demoraDH: d => timeDeltaWToDH(d.demora)
      })
    )
    data.value.length && data.value.push(...summary.value) // New: include summary in data
  }
  function get(params) {
    loading.value = true
    axios
      .get('/report/consultadas', { params })
      .then(res => setData(res.data))
      .catch(() => { })
      .finally(() => loading.value = false)
  }
  const reset = () => setData([])
  const noData = computed(() => !loading.value && !count.value)
  return { data, noData, summary, get, reset, loading }
})

export default defineStore('http-client', () => {
  const externas = useExternas()
  const internas = useInternas()
  const consultadas = useConsultadas()
  return { externas, internas, consultadas }
})
