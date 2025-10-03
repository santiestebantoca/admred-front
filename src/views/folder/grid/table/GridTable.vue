<script setup>
import useFolderFields from './fields'
import useFolderStore from '@/stores/folder'
import { shorterTime, listTime } from '@/use/useDates'
import { useResizeObserver } from '@vueuse/core'
import { useBreakpoints, breakpointsBootstrapV5 } from '@vueuse/core'
import { ref, watch, inject } from 'vue'

const params = inject('folder:params')
const breakpoints = useBreakpoints(breakpointsBootstrapV5)
const mobile = breakpoints.smaller('md')
const { ths, names, set } = useFolderFields()
const folder = useFolderStore()
const itemId = ref(null) // Just to spot a row in table
const data = ref([])
watch(params, () => itemId.value = null)
watch([() => folder.data, itemId], ([val, id]) => {
  // I want to react just on data or itemId changes, not on params changes
  // That's why it is watch, not a computed...
  const { tray, state } = params.value
  set(tray, state)
  data.value = val.map(d => ({
    id: d.id,
    cls: d.id === id ? 'tr-active' : '',
    root: d.root,
    codigo: d.codigo,
    presentada: mobile.value ? shorterTime(d.solicitado_en) : listTime(d.solicitado_en),
    dePara: names.value.includes('origen') ? d.origen : d.destino,
    deParaLabel: names.value.includes('origen') ? 'De: ' : 'A: ',
    objetivo: d.objetivo,
    estadoTerminada: names.value.includes('terminado_en')
      ? mobile.value ? shorterTime(d.terminado_en) : listTime(d.terminado_en)
      : d.estado,
  }))
})
function thClick(name) {
  let obj
  if (folder.orderBy.field === name) {
    if (folder.orderBy.direction === null)
      obj = { field: name, direction: 'asc' }
    if (folder.orderBy.direction === 'asc')
      obj = { field: name, direction: 'desc' }
    if (folder.orderBy.direction === 'desc')
      obj = { field: null, direction: null }
  } else obj = { field: name, direction: 'asc' }
  folder.orderBy = obj
}
// Layout logic for Table compact & height
const height = ref(null)
const container = ref(null)
useResizeObserver(container, entries => {
  height.value = `${entries[0].contentRect.height - entries[0].contentRect.height % 42}px`
})
</script>

<template>
  <div>
    <template v-if="folder.status.loaded">
      <div v-if="!folder.page.total" class="text-center mt-4 p-5">
        No hay elementos que mostrar.<br>
        <span v-if="folder.searchBy.search">(Revise sus opciones de búsqueda)</span>
      </div>
      <template v-else>
        <div v-if="mobile">
          <div class="p-2" v-for="d in data" :key="d.id" :class="d.class"
            @click="$router.push({ query: { item: d.id } }); itemId = d.id">
            <div class="hstack fw-semibold">
              <div class="text-truncate">
                <span class="text-muted" v-text="d.deParaLabel" />
                <span class="-fw-semibold" v-text="d.dePara" />
              </div>
              <span class="ms-auto text-muted small text-nowrap" v-text="d.presentada" />
            </div>
            <div class="text-truncate text-muted" v-text="d.objetivo" />
          </div>
        </div>
        <div v-else class="h-100 overflow-hidden" ref="container">
          <bs-table-scroller class="height">
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
          </bs-table-scroller>
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped>
.wrap {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.height {
  height: v-bind(height);
}

/** tr */

.table-custom tbody tr td:first-child {
  position: relative;
  padding-left: 10px;
  --before-bg-color: transparent;
}

.table-custom tbody tr td:first-child::before {
  content: '';
  position: absolute;
  top: 1px;
  bottom: 2px;
  left: 0;
  width: 3px;
  background-color: var(--before-bg-color);
}

/** tr:hover */

.table-custom tbody tr:not(.tr-active):hover td:first-child {
  --before-bg-color: var(--bs-gray-400);
}

.table-custom tbody tr:not(.tr-active):hover td {
  color: var(--bs-dark) !important;
  background-color: var(--gg-light-1);
}

/** tr.tr-active */

.table-custom tbody tr.tr-active td:first-child {
  --before-bg-color: rgba(var(--bs-primary-rgb), .9);
}

.table-custom tbody tr.tr-active td {
  color: var(--bs-dark) !important;
  /* background-color: var(--bs-primary-bg-subtle); */
  background-color: aliceblue;
}
</style>