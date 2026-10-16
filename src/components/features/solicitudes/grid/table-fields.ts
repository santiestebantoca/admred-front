import type { TableFieldRaw } from 'bootstrap-vue-next'
import { listTime } from '@/composables/useDates'
import { ref, computed } from 'vue'

type SolicitudRecibida = [
  number,              // 0 - id
  string,              // 1 - codigo
  string,              // 2 - objetivo
  string,              // 3 - estado
  string,              // 4 - solicitadoEn
  string | null,       // 5 - terminadoEn
  string,              // 6 - origen
  number | null        // 7 - root
]

type SolicitudEnviada = [
  number,              // 0 - id
  string,              // 1 - codigo
  string,              // 2 - objetivo
  string,              // 3 - estado
  string,              // 4 - solicitadoEn
  string | null,       // 5 - terminadoEn
  string,              // 6 - destino
  number | null        // 7 - root
]

const fieldsRecibidasPendientes: TableFieldRaw<SolicitudRecibida>[] = [
  {
    key: '1',
    label: '#',
    sortable: true,
    tdClass: 'td-codigo',
  },
  {
    key: '2',
    label: 'Objetivo',
    sortable: false,
    tdClass: 'td-objetivo',
  },
  {
    key: '6',
    label: 'De',
    sortable: true,
  },
  {
    key: '4',
    label: 'Presentada',
    sortable: true,
    tdClass: 'td-fecha',
    formatter: ({ value }) => listTime(value)
  },
  {
    key: '3',
    label: 'Estado',
    sortable: true,
  },
]

const fieldsRecibidasTerminadas: TableFieldRaw<SolicitudRecibida>[] = [
  {
    key: '1',
    label: '#',
    sortable: true,
    tdClass: 'td-codigo',
  },
  {
    key: '2',
    label: 'Objetivo',
    sortable: false,
    tdClass: 'td-objetivo',
  },
  {
    key: '6',
    label: 'De',
    sortable: true,
  },
  {
    key: '5',
    label: 'Terminada',
    sortable: true,
    tdClass: 'td-fecha',
    formatter: ({ value }) => listTime(value)
  },
]

const fieldsEnviadasPendientes: TableFieldRaw<SolicitudEnviada>[] = [
  {
    key: '1',
    label: '#',
    sortable: true,
    tdClass: 'td-codigo',
  },
  {
    key: '2',
    label: 'Objetivo',
    sortable: false,
    tdClass: 'td-objetivo',
  },
  {
    key: '6',
    label: 'A',
    sortable: true,
  },
  {
    key: '4',
    label: 'Presentada',
    sortable: true,
    tdClass: 'td-fecha',
    formatter: ({ value }) => listTime(value)
  },
  {
    key: '3',
    label: 'Estado',
    sortable: true,
  },
]

const fieldsEnviadasTerminadas: TableFieldRaw<SolicitudEnviada>[] = [
  {
    key: '1',
    label: '#',
    sortable: true,
    tdClass: 'td-codigo',
  },
  {
    key: '2',
    label: 'Objetivo',
    sortable: false,
    tdClass: 'td-objetivo',
  },
  {
    key: '6',
    label: 'A',
    sortable: true,
  },
  {
    key: '5',
    label: 'Terminada',
    sortable: true,
    tdClass: 'td-fecha',
    formatter: ({ value }) => listTime(value)
  },
]

export function useFields() {
  const tray = ref(undefined)
  const state = ref(undefined)
  const fields = computed(() => {
    if (tray.value === 'recibidas') {
      if (state.value === 'pendientes') return fieldsRecibidasPendientes
      else if (state.value === 'terminadas') return fieldsRecibidasTerminadas
    } else if (tray.value === 'enviadas') {
      if (state.value === 'pendientes') return fieldsEnviadasPendientes
      else if (state.value === 'terminadas') return fieldsEnviadasTerminadas
    }
  })
  return { fields, tray, state }
}