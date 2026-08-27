<script setup>
import { useFields } from './fields'
import { useSolicitudesQuery } from '@/stores/solicitudes'
import { useResizeObserver } from '@vueuse/core'
import { ref, inject, useTemplateRef, watchEffect } from 'vue'

const mobile = inject('app:mobile')
const flows = inject('solicitudes:flows')
const { fields, tray: _tray, state: _state } = useFields()
const { solicitudes, total, isPending, isLoading, tray, state, isFiltered } = useSolicitudesQuery()
const active = ref([flows.value.solicitud.active])

watchEffect(() => {
  _tray.value = tray.value
  _state.value = state.value
})

const onSelectedItem = (val) => flows.value.solicitud.go(val[0])
// Layout logic for Table compact & height
const height = ref(null)
const container = useTemplateRef('container')
useResizeObserver(container, entries => {
  height.value = `${entries[0].contentRect.height - entries[0].contentRect.height % 42}px`
})
</script>

<template>
  <div class="text-center p-5" v-if="isPending">
    <BSpinner />
  </div>
  <template v-else>
    <div v-if="!total" class="text-center p-5">
      No hay elementos que mostrar.<br>
      <span v-if="isFiltered">(Revise los filtros aplicados)</span>
    </div>
    <template v-else>
      <div v-if="mobile">
        <!-- <div class="p-2" v-for="d in solicitudes" :key="d.id" :class="d.class"
          @click="$router.push({ query: { item: d.id } }); itemId = d.id">
          <div class="hstack fw-semibold">
            <div class="text-truncate">
              <span class="text-muted" v-text="d.deParaLabel" />
              <span class="-fw-semibold" v-text="d.dePara" />
            </div>
            <span class="ms-auto text-muted small text-nowrap" v-text="d.presentada" />
          </div>
          <div class="text-truncate text-muted" v-text="d.objetivo" />
        </div> -->
      </div>
      <div v-else class="h-100 overflow-hidden" ref="container" style="-padding:12px">
        <BTable fixed :sticky-header="height" :items="solicitudes" :fields="fields" primary-key="0"
          :tbody-tr-class="rowClass" :thClass="['custom-th']" :busy="isLoading" selectable select-mode="single"
          @update:selected-items="onSelectedItem" v-model:selected-items="active">
          <template #table-colgroup>
            <col style="width:110px" />
            <col style="width:50%" />
            <col />
            <col style="width:146px" />
            <col v-if="state === 'pendientes'" style="width:120px" />
          </template>
        </BTable>
      </div>
    </template>
  </template>
</template>

<style scoped lang="scss">
:deep(.b-table) {
  thead {
    th {
      font-size: .875em;
      font-weight: 600;
    }
  }
}

/* .wrap {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.height {
  height: v-bind(height);
} */

/** tr */

/* .table-custom tbody tr td:first-child {
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
} */

/** tr:hover */
/* 
.table-custom tbody tr:not(.tr-active):hover td:first-child {
  --before-bg-color: var(--bs-gray-400);
}

.table-custom tbody tr:not(.tr-active):hover td {
  color: var(--bs-dark) !important;
  background-color: var(--gg-light-1);
} */

/** tr.tr-active */
/* 
.table-custom tbody tr.tr-active td:first-child {
  --before-bg-color: rgba(var(--bs-primary-rgb), .9);
}

.table-custom tbody tr.tr-active td {
  color: var(--bs-dark) !important;
  // background-color: var(--bs-primary-bg-subtle); //
  background-color: aliceblue;
} */
</style>