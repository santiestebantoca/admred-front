import axios from './axios'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { tidy, mutate, groupBy, summarize, mean } from '@tidyjs/tidy'
import { timeDeltaW, timeDeltaWToDH } from '@/use/useTimeDelta'

const usePending = defineStore('report-pending', () => {
  const data = ref(null)
  const count = ref(null)
  const loading = ref(false)
  function get() {
    loading.value = true
    axios
      .get('/report/pendientes')
      .then(res => setData(res.data))
      .catch(() => { })
      .finally(() => loading.value = false)
  }
  function setData(data_) {
    data.value = data_
    count.value = data_?.length
  }
  const noData = computed(() => !loading.value && !count.value)
  return { data, get, loading, noData }
})
const useExternasAreas = defineStore('report-externas-areas', () => {
  const data = ref(null)
  function get() {
    axios
      .get('/report/areas?nivel=4')
      .then(res => data.value = res.data)
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
      .then(res => data.value = res.data)
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
const useAsSupervisor = defineStore('report-person-solicitudes-supervisor', () => {
  const data_ = ref([])
  const data = computed({
    set(value) { return data_.value = value },
    get() {
      return tidy(
        data_.value || [],
        mutate({
          demoraAsignacion: d => timeDeltaW(d.solicitado_en, d.tramitador_en),
          demoraEvaluacion: d => timeDeltaW(d.respuesta_en, d.terminado_en),
          demoraSupervisor: d => d.demoraAsignacion + d.demoraEvaluacion,
          demoraAsignacionDH: d => timeDeltaWToDH(d.demoraAsignacion),
          demoraEvaluacionDH: d => timeDeltaWToDH(d.demoraEvaluacion),
          demoraSupervisorDH: d => timeDeltaWToDH(d.demoraSupervisor),
        }))
    }
  })
  const resume = computed(() =>
    tidy(
      data.value,
      summarize({
        supervisadas: items => items.length,
        terminadas: items => items.filter(item => item.terminado_en).length,
        demora: mean('demoraSupervisor'),
      }),
      mutate({ demoraDH: d => timeDeltaWToDH(Math.trunc(d.demora)) })
    )[0])
  return { data, resume }
})
const useAsTramitador = defineStore('report-person-solicitudes-tramitador', () => {
  const data_ = ref([])
  const data = computed({
    set(value) { return data_.value = value },
    get() {
      // [Aldo, 2021-12-21] Si no tiene reenvio, Tiempo de Reenvio = 0
      // Luego,
      // Tiempo de Respuesta = hijo_terminado
      // ? de hijo_terminado a respuesta
      // : si no tiene hijos, de asignado a respuesta
      return tidy(
        data_.value || [],
        mutate({
          demoraReenvio: d => timeDeltaW(d.hijo_en && d.tramitador_en, d.hijo_en),
          demoraRespuesta: d => d.hijo_terminado_en
            ? timeDeltaW(d.hijo_terminado_en, d.respuesta_en)
            : timeDeltaW(!d.hijo_en && d.tramitador_en, d.respuesta_en),
          demoraTramitador: d => d.demoraReenvio + d.demoraRespuesta,
          demoraReenvioDH: d => timeDeltaWToDH(d.demoraReenvio),
          demoraRespuestaDH: d => timeDeltaWToDH(d.demoraRespuesta),
          demoraTramitadorDH: d => timeDeltaWToDH(d.demoraTramitador),
        })
      )
    }
  })
  const resume = computed(() =>
    tidy(
      data.value,
      summarize({
        asignadas: items => items.length,
        terminadas: items => items.filter(item => item.terminado_en).length,
        demora: mean('demoraTramitador'),
      }),
      mutate({ demoraDH: d => timeDeltaWToDH(Math.trunc(d.demora)) })
    )[0])
  return { data, resume }
})
const usePersonSolicitudes = defineStore('report-person-solicitudes', () => {
  const asSupervisor = useAsSupervisor()
  const asTramitador = useAsTramitador()
  const count = ref(null)
  const loading = ref(false)
  function setData(_data) {
    count.value = _data?.length
    asSupervisor.data = _data?.filter(d => d.supervisor)
    asTramitador.data = _data?.filter(d => d.tramitador)
  }
  function get(params) {
    loading.value = true
    axios
      .get(`/report/solicitudes`, { params })
      .then(res => setData(res.data))
      .catch(() => { })
      .finally(() => loading.value = false)
  }
  const reset = () => setData([])
  const noData = computed(() => !loading.value && !count.value)
  return { noData, count, asSupervisor, asTramitador, get, reset, loading }
})
const usePerson = defineStore('report-person', () => {
  const solicitudes = usePersonSolicitudes()
  const data = ref(null)
  function get() {
    axios
      .get('/report/person')
      .then(res => data.value = res.data)
      .catch(() => { })
  }
  return { solicitudes, data, get }
})
const useBuscar = defineStore('report-buscar', () => {
  const data = ref(null)
  function get(codigo) {
    axios
      .get('/report/buscar?codigo=' + codigo)
      .then(res => data.value = res.data)
      .catch(() => { })
  }
  const reset = () => data.value = null
  return { data, get, reset }
})

export default defineStore('http-client', () => {
  const pending = usePending()
  const externas = useExternas()
  const internas = useInternas()
  const consultadas = useConsultadas()
  const person = usePerson()
  const buscar = useBuscar()
  return { pending, externas, internas, consultadas, person, buscar }
})
