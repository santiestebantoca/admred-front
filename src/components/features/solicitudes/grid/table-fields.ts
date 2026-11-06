import type { TableFieldRaw } from 'bootstrap-vue-next'
import { listTime } from '@/composables/useDates'
import { computed, toValue } from 'vue'

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

// BTable aplica `unref` al resultado del formatter, así que puede recibir el
// Ref reactivo de `listTime` (se actualiza a medianoche), pero su tipo
// declarado exige un string.
const formatearFecha = ({ value }: { value: unknown }) =>
  listTime(value as string) as unknown as string

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
    formatter: formatearFecha
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
    formatter: formatearFecha
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
    formatter: formatearFecha
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
    formatter: formatearFecha
  },
]

export function useFields(tray, state) {
  const fields = computed(() => {
    if (toValue(tray) === 'recibidas') {
      if (toValue(state) === 'pendientes') return fieldsRecibidasPendientes
      else if (toValue(state) === 'terminadas') return fieldsRecibidasTerminadas
    } else if (toValue(tray) === 'enviadas') {
      if (toValue(state) === 'pendientes') return fieldsEnviadasPendientes
      else if (toValue(state) === 'terminadas') return fieldsEnviadasTerminadas
    }
  })
  return { fields }
}