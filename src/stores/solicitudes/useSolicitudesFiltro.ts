import { ref, computed, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import type { EstadoId, EstadoLista, Periodo, SolicitudesParams, Tray } from '@/types/api'

export const useSolicitudesFiltro = defineStore('solicitudes-filtro', () => {
  const tray = ref<Tray>() // Filtro base - requerido, va en la ruta, resetea filtros complementarios
  const state = ref<EstadoLista>() // Filtro base - requerido, va en la ruta, resetea filtros complementarios
  const status = ref<EstadoId>() // Filtro complementario
  const period = ref<Periodo>() // Filtro complementario
  const search = ref<string>() // Filtro complementario de search (toma valor si search y tray)

  const search_in = computed(() => search.value && tray.value
    ? ['codigo', 'objetivo', tray.value === 'recibidas' ? 'origen' : 'destino']
    : undefined)

  const filtro = computed<SolicitudesParams | undefined>(() => {
    if (tray.value === undefined || state.value === undefined) return undefined
    return {
      tray: tray.value,
      state: state.value,
      ...status.value ? { status: status.value } : {},
      ...period.value ? { period: period.value } : {},
      ...search.value ? { search: search.value } : {},
      ...search_in.value ? { search_in: search_in.value } : {},
    }
  })

  watchEffect(() => period.value = state.value === 'terminadas' ? 1 : undefined)

  const isFiltered = computed(() => Boolean(filtro.value && Object.keys(filtro.value).length > 2))

  const setFiltroBase = (newTray: Tray, newState: EstadoLista) => {
    // Si ya existía un filtro base previo (no es undefined), es un cambio de contexto real -> Resetear
    if (tray.value !== undefined || state.value !== undefined) {
      // Y además, si los valores son realmente distintos
      if (tray.value !== newTray || state.value !== newState) {
        resetComplementarios()
      }
    }
    tray.value = newTray
    state.value = newState
  }

  const resetComplementarios = () => {
    status.value = undefined
    period.value = state.value === 'terminadas' ? 1 : undefined
    search.value = undefined
  }

  return {
    tray,
    state,
    status,
    period,
    search,
    search_in,
    filtro,
    isFiltered,
    setFiltroBase
  }
}, {
  persist: {
    storage: sessionStorage, // Solo vive en la sesión actual
    pick: ['status', 'period', 'search']
  }
})
