<script setup>
import { shorterTime } from '@/composables/useDates'
import { useFields } from './fields'
import { useSolicitudesQuery } from '@/stores/solicitudes'
import { useResizeObserver } from '@vueuse/core'
import { ref, computed, inject, useTemplateRef, watchEffect } from 'vue'

const mobile = inject('app:mobile')
const flows = inject('solicitudes:flows')
const filaExpandida = inject('solicitudes:filaExpandida')
const { fields, tray: _tray, state: _state } = useFields()
const { solicitudes, total, isPending, isLoading, tray, state, isFiltered } = useSolicitudesQuery()
const active = ref([flows.value.solicitud.active])
const height = ref(null)
const container = useTemplateRef('container')
const rootStyle = computed(() => ({
  '--td-white-space': filaExpandida.value ? 'unset' : 'nowrap'
}))

watchEffect(() => {
  _tray.value = tray.value
  _state.value = state.value
})
useResizeObserver(container, entries => {
  const containerHeight = entries[0].contentRect.height
  height.value = `${containerHeight - containerHeight % 41}px`
})

const onSelectedItem = (val) => flows.value.solicitud.go(val[0])
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
      <div v-else class="table-large-container" ref="container" :style="rootStyle">
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
}

:deep(.b-table) {
  thead {
    th {
      font-size: .875em;
      font-weight: 600;
    }
  }

  tbody {
    td {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: var(--td-white-space);
    }
  }
}
</style>