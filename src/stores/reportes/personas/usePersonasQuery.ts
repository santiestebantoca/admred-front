import { tidy, mutate, summarize, mean } from '@tidyjs/tidy'
import { timeDeltaW, timeDeltaWToDH } from '@/composables/useTimeDelta'
import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { reportesApi as api } from '@/api/reportes'
import { ref, computed, watchEffect } from 'vue'

export const usePersonasQuery = (_personaId: number) => {
  const comoSupervisor = useComoSupervisor()
  const comoTramitador = useComoTramitador()
  const personaId = ref(_personaId)
  const periodo = ref(undefined)
  const params = computed(() => ({
    user_id: personaId.value,
    month: periodo.value?.month,
    year: periodo.value?.year
  }))
  const enabled = computed(() => Object.values(params.value).every(v => v != null))

  const { data, isPending, refetch } = useQuery({
    key: () => queryKeys.reportes.personas.lista(params.value),
    query: () => api.personas.getAll(params.value),
    enabled: () => enabled.value,
    staleTime: Infinity
  })

  watchEffect(() => {
    comoSupervisor.setData(data.value?.filter(d => d.supervisor))
    comoTramitador.setData(data.value?.filter(d => d.tramitador))
  })

  return {
    pendientes: data,
    comoSupervisor,
    comoTramitador,
    total: computed(() => data.value?.length),
    isPending,
    enabled,
    personaId,
    periodo,
    refetch
  }
}

const useComoSupervisor = () => {
  const rawData = ref([])
  const data = computed(() =>
    tidy(
      rawData.value || [],
      mutate({
        demoraAsignacion: d => timeDeltaW(d.solicitado_en, d.tramitador_en),
        demoraEvaluacion: d => timeDeltaW(d.respuesta_en, d.terminado_en),
        demoraSupervisor: d => d.demoraAsignacion + d.demoraEvaluacion,
        demoraAsignacionDH: d => timeDeltaWToDH(d.demoraAsignacion),
        demoraEvaluacionDH: d => timeDeltaWToDH(d.demoraEvaluacion),
        demoraSupervisorDH: d => timeDeltaWToDH(d.demoraSupervisor),
      }))
  )
  const resumen = computed(() =>
    tidy(
      data.value,
      summarize({
        supervisadas: items => items.length,
        terminadas: items => items.filter(item => item.terminado_en).length,
        demora: mean('demoraSupervisor'),
      }),
      mutate({ demoraDH: d => timeDeltaWToDH(Math.trunc(d.demora)) })
    )[0])
  const setData = (value) => { rawData.value = value }
  return { data, resumen, setData }
}

const useComoTramitador = () => {
  const rawData = ref([])
  const data = computed(() =>
    tidy(
      rawData.value || [],
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
  )
  const resumen = computed(() =>
    tidy(
      data.value,
      summarize({
        asignadas: items => items.length,
        terminadas: items => items.filter(item => item.terminado_en).length,
        demora: mean('demoraTramitador'),
      }),
      mutate({ demoraDH: d => timeDeltaWToDH(Math.trunc(d.demora)) })
    )[0])
  const setData = (value) => { rawData.value = value }
  return { data, resumen, setData }
}