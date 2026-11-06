<script lang="ts" setup>
import { shorterTime } from '@/composables/useDates'
import IndicadorCarga from '@/components/commons/IndicadorCarga.vue'
import TablaEsqueleto from '@/components/commons/TablaEsqueleto.vue'
import { useFields } from './table-fields'
import { useSolicitudesQuery } from '@/stores/solicitudes'
import { useSelectedItems } from '@/composables/useSelectedItems'
import type { EstadoLista, SolicitudListaTupla, Tray } from '@/types/api'
import { useResizeObserver } from '@vueuse/core'
import { ref, computed, inject, useTemplateRef, watchEffect, type Ref } from 'vue'

const mobile = inject<Ref<boolean>>('app:mobile')
const tray = inject<Ref<Tray>>('solicitudes:tray')
const state = inject<Ref<EstadoLista>>('solicitudes:state')
const solicitudId = inject<Ref<number | undefined>>('solicitudes:solicitudId')
const setSolicitudId = inject<Ref<(solicitudId?: number) => void>>('solicitudes:setSolicitudId')
const filaExpandida = inject<Ref<boolean>>('solicitudes:filaExpandida')
const { fields } = useFields(tray, state)
const { solicitudes, total, isPending, isLoading, isFiltered } = useSolicitudesQuery()
const height = ref<string>()
const container = useTemplateRef<HTMLElement>('container')
const active = ref<number[]>([]) // Mantener marcada la fila
const selectedItems = useSelectedItems<SolicitudListaTupla>(active, (ids) => ids.length && setSolicitudId.value(ids[0]))
const rootStyle = computed(() => ({
  '--td-white-space': filaExpandida.value ? 'unset' : 'nowrap'
}))

watchEffect(() => solicitudId.value && (active.value = [solicitudId.value]))
useResizeObserver(container, entries => {
  const containerHeight = entries[0].contentRect.height
  height.value = `${containerHeight - containerHeight % 41}px`
})

const onSelectedItem = (val: SolicitudListaTupla) => setSolicitudId.value(val[0])
</script>

<template>
  <div v-if="isPending" class="py-3">
    <TablaEsqueleto :filas="7" :columnas="4" texto="Cargando solicitudes…" />
  </div>
  <template v-else>
    <div v-if="!total" class="text-center py-5">
      No hay elementos que mostrar.<br>
      <span v-if="isFiltered">(Revise los filtros aplicados)</span>
    </div>
    <div v-else class="table-wrapper position-relative" :aria-busy="isLoading">
      <div v-if="isLoading" class="indicador-actualizacion">
        <IndicadorCarga inline texto="Actualizando…" />
      </div>
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
        <BTable fixed :sticky-header="height" :items="solicitudes" :fields="fields" primary-key="0" selectable
          select-mode="single" hover v-model:selected-items="selectedItems">
          <template #table-colgroup>
            <!-- <col style="width:80px" /> -->
            <col style="width:110px" />
            <col style="width:45%" />
            <col :style="{ width: state === 'pendientes' ? '20%' : '25%' }" />
          </template>
          <template #[`cell(3)`]="{ value }">
            <span class="estado-badge" :data-estado="value">{{ value }}</span>
          </template>
        </BTable>
      </div>
    </div>
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

.table-wrapper {
  // El contenedor de la tabla se estira al alto que le da la fila `1fr` de
  // ListaGrid.vue. Este wrapper debe transmitir ese alto, no calcularlo a
  // partir del contenido: `min-height: 0` evita que su tamaño mínimo lo
  // empuje a crecer con la tabla, y el flex hace que el hijo lo ocupe entero.
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.table-large-container {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  padding-top: 8px;
  padding-bottom: 8px;

  .b-table-sticky-header {
    padding-right: 16px;
    overflow-y: scroll;
    height: 100%;
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

        td {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: var(--td-white-space);
          transition: background-color .15s;


          &.td-codigo {
            font-weight: 600;
          }

          &.td-fecha {
            color: var(--bs-gray-700);
          }

          .estado-badge {
            margin-top: -1px;
            margin-bottom: -1px;
            position: relative;
          }
        }
      }
    }
  }


}
</style>