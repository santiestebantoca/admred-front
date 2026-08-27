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
  },
  {
    key: '2',
    label: 'Objetivo',
    sortable: true,
  },
  {
    key: '6',
    label: 'De',
    sortable: true,
  },
  {
    key: '4',
    label: 'Presentada',
    accessor: (item) => listTime(item[4]),
    sortable: true,
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
  },
  {
    key: '2',
    label: 'Objetivo',
    sortable: true,
  },
  {
    key: '6',
    label: 'De',
    sortable: true,
  },
  {
    key: '5',
    label: 'Terminada',
    accessor: (item) => listTime(item[5]),
    sortable: true,
  },
]

const fieldsEnviadasPendientes: TableFieldRaw<SolicitudEnviada>[] = [
  {
    key: '1',
    label: '#',
    sortable: true,
  },
  {
    key: '2',
    label: 'Objetivo',
    sortable: true,
  },
  {
    key: '6',
    label: 'A',
    sortable: true,
  },
  {
    key: '4',
    label: 'Presentada',
    accessor: (item) => listTime(item[4]),
    sortable: true,
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
  },
  {
    key: '2',
    label: 'Objetivo',
    sortable: true,
  },
  {
    key: '6',
    label: 'A',
    sortable: true,
  },
  {
    key: '5',
    label: 'Terminada',
    accessor: (item) => listTime(item[5]),
    sortable: true,
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
  // d.id === id ? 'tr-active' : ''
  // mobile.value ? shorterTime(d.solicitado_en) : listTime(d.solicitado_en)
  return { fields, tray, state }
}

/*
<!-- <bs-table-scroller class="height">
            <bs-table stickyHeader class="px-3 table-custom" hover>
              <template #colgroup>
                <col style="width:110px" />
                <col style="width:50%" />
                <col style="width:25%" />
                <col style="" />
                <col style="" />
              </template>
<template #thead>
                <tr>
                  <bs-table-th v-for="{ name, label } in ths" :key="name" :label="label"
                    :order="folder.orderBy.field === name && folder.orderBy.direction" @click="thClick(name)" />
                </tr>
              </template>
<template #tbody>
                <tr v-for="d in data" :key="d.id" :class="d.cls" type="button"
                  @click="$router.replace({ query: { item: d.id } }); itemId = d.id">
                  <td class="wrap codigo">
                    <span v-text="d.codigo" />
                  </td>
                  <td class="bold pe-4 wrap" v-text="d.objetivo" />
                  <td class="bold wrap" v-text="d.dePara" />
                  <td class="wrap" v-text="d.presentada" />
                  <td class="wrap" v-text="d.estadoTerminada" />
                </tr>
              </template>
</bs-table>
</bs-table-scroller> -->
*/