<script setup>
import { shorterTime } from '@/composables/useDates'
import { useFields } from './table-fields'
import { useSolicitudesQuery } from '@/stores/solicitudes'
import { useResizeObserver } from '@vueuse/core'
import { ref, computed, inject, useTemplateRef, watchEffect } from 'vue'

const mobile = inject('app:mobile')
const tray = inject('solicitudes:tray')
const state = inject('solicitudes:state')
const solicitudId = inject('solicitudes:solicitudId')
const setSolicitudId = inject('solicitudes:setSolicitudId')
const filaExpandida = inject('solicitudes:filaExpandida')
const { fields, tray: _tray, state: _state } = useFields()
const { solicitudes, total, isPending, isLoading } = useSolicitudesQuery()
const height = ref(null)
const container = useTemplateRef('container')
const active = ref(undefined) // Mantener marcada la fila
const rootStyle = computed(() => ({
  '--td-white-space': filaExpandida.value ? 'unset' : 'nowrap'
}))

watchEffect(() => {
  _tray.value = tray.value
  _state.value = state.value
})
watchEffect(() => solicitudId.value && (active.value = [solicitudId.value]))
useResizeObserver(container, entries => {
  const containerHeight = entries[0].contentRect.height
  height.value = `${containerHeight - containerHeight % 41.9}px`
})

const onSelectedItem = (val) => setSolicitudId.value(val[0])
</script>

<template>
  <div class="text-center p-5 mt-5" v-if="isPending">
    <BSpinner />
  </div>
  <template v-else>
    <div v-if="!total" class="text-center p-5">
      No hay elementos que mostrar.<br>
      <span v-if="isFiltered">(Revise los filtros aplicados)</span>
    </div>
    <template v-else>
      <BContainer v-if="mobile" class="table-mobile-container" :style="rootStyle">
        <BRow v-for="d in solicitudes" :key="d[0]" @click="onSelectedItem(d)">
          <BCol class="presentacion-de-para">
            {{ tray === 'recibidas' ? 'De:' : 'Para:' }}
            {{ d[6] }}
          </BCol>
          <BCol cols="auto" class="presentacion-presentada">
            {{ shorterTime(d[4]) }}
          </Bcol>
          <BCol cols="12" class="presentacion-objetivo">
            <p>{{ d[2] }}</p>
          </BCol>
        </BRow>
      </BContainer>
      <div v-else class="table-large-container" ref="container" :style="rootStyle" v-bind="$attrs">
        <BTable fixed :sticky-header="height" :items="solicitudes" :fields="fields" primary-key="0" :busy="isLoading"
          selectable select-mode="single" hover @update:selected-items="onSelectedItem" v-model:selected-items="active">
          <template #table-colgroup>
            <col style="width:80px" />
            <col style="width:50%" />
            <col :style="{ width: state === 'pendientes' ? '20%' : '25%' }" />
          </template>
          <template #[`cell(3)`]="{ value }">
            <span class="estado-badge" :data-estado="value">{{ value }}</span>
          </template>
        </BTable>
      </div>
    </template>
  </template>
</template>

<style scoped lang="scss">
.table-mobile-container {
  overflow: hidden;
  padding-top: 8px;
  padding-bottom: 8px;

  .row {
    overflow: hidden;
    border-top: 1px solid var(--bs-border-color);

    >div {
      min-width: 0;
      overflow: hidden;

      &.presentacion-de-para {
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 600;
        margin-top: 2px;
        margin-bottom: 2px;
      }

      &.presentacion-presentada {
        color: var(--bs-gray-600);
        margin-top: 2px;
        margin-bottom: 2px;
      }

      &.presentacion-objetivo {
        color: var(--bs-gray-800);

        p {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: var(--td-white-space);
        }
      }
    }
  }
}

.table-large-container {
  overflow: hidden;
  padding-top: 8px;
  padding-bottom: 8px;

  .b-table-sticky-header {
    padding-right: 16px;
    overflow-y: scroll;
    height: 100%;
  }
}

:deep(.b-table) {
  --bvn-sort-icon-none: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%23212529' viewBox='0 0 16 16'%3e%3cpath fill-rule='evenodd' opacity='0.4' d='M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z'/%3e%3c/svg%3e");
  --bvn-sort-icon-asc: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%23212529' viewBox='0 0 16 16'%3e%3cpath fill-rule='evenodd' d='M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z'/%3e%3c/svg%3e");
  --bvn-sort-icon-desc: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%23212529' viewBox='0 0 16 16'%3e%3cpath fill-rule='evenodd' d='M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z'/%3e%3c/svg%3e");
  --bs-table-hover-bg: rgba(var(--bs-surface-5-rgb), .3);

  thead {
    th {
      font-size: .875em;
      font-weight: 600;
      line-height: 24px;
    }
  }

  tbody {
    tr {
      cursor: pointer;
    }

    td {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: var(--td-white-space);
      transition: background-color .15s;
    }
  }
}

:deep(.td-codigo) {
  font-weight: 600;
}

:deep(.td-objetivo) {}

:deep(.td-fecha) {
  color: var(--bs-gray-700);
}
</style>