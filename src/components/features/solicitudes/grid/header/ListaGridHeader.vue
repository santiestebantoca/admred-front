<script setup>
import ListaSearch from './ListaSearch.vue'
import ListaPeriod from './ListaPeriod.vue'
import ListaStatus from './ListaStatus.vue'
import { useSolicitudesQuery } from '@/stores/solicitudes'
import useExportCSV from '@/composables/useExportCSV.js'
import { formatTime } from '@/composables/useDates'
import { inject } from 'vue'

const mobile = inject('app:mobile')
const params = inject('solicitudes:params')
const filaExpandida = inject('solicitudes:filaExpandida')
const { solicitudes, refresh } = useSolicitudesQuery()
const { exportCSV, exportCSVTuplas } = useExportCSV()

/**
 * Exporta a CSV usando `exportCSV` (lista de objetos Record<string, any>).
 *
 * Este es el formato de exportación ANTERIOR, cuando las solicitudes llegaban
 * como lista de objetos con propiedades nombradas (codigo, objetivo, origen/
 * destino, solicitado_en, estado/terminado_en). Se conserva documentada por si
 * en el futuro se vuelve a trabajar con ese formato; actualmente los datos son
 * tuplas fijas y se usa `exportar` (con `exportCSVTuplas`).
 */
const exportarObjetos = () => {
  const { tray, state } = params.value
  const fields = [
    'codigo as Codigo',
    'objetivo as Objetivo',
    tray === 'recibidas'
      ? 'origen as Demandante'
      : 'destino as Area_consultada',
    'solicitado_en as Presentada',
    state === 'pendientes'
      ? 'estado as Estado'
      : 'terminado_en as Terminada',
  ].join(',')
  exportCSV(fields, solicitudes.value)
}

const exportar = () => {
  const { tray, state } = params.value
  const dePara = tray === 'recibidas' ? 'De' : 'A'
  const columns = [
    { label: '#', value: (f) => f[1] },
    { label: 'Objetivo', value: (f) => f[2] },
    { label: dePara, value: (f) => f[6] },
    ...(state === 'pendientes'
      ? [
        { label: 'Presentada', value: (f) => formatTime(f[4]) },
        { label: 'Estado', value: (f) => f[3] },
      ]
      : [
        { label: 'Terminada', value: (f) => formatTime(f[5]) },
      ]),
  ]
  exportCSVTuplas(columns, solicitudes.value)
}
const expandir = () => filaExpandida.value = !filaExpandida.value
</script>

<template>
  <BContainer fluid class="py-2">
    <BRow>
      <BCol cols="auto" class="me-auto">
        <ListaPeriod v-if="params.state === 'terminadas'" />
        <ListaStatus v-else-if="params.state === 'pendientes'" />
      </BCol>
      <!-- <BCol></BCol> -->
      <BCol v-if="!mobile" cols="auto">
        <ListaSearch style="width:400px" />
      </BCol>
      <BCol v-if="!mobile" cols="auto" class="pe-1">
        <BButton @click="refresh" variant="list-header" v-tippy="'Actualizar'">
          <UIcon name="bi-arrow-repeat" />
        </BButton>
      </BCol>
      <BCol cols="auto" class="pe-1">
        <BButton @click="exportar" variant="list-header" v-tippy="'Exportar (*.csv)'">
          <UIcon name="bi-filetype-csv" />
        </BButton>
      </BCol>
      <BCol cols="auto">
        <BButton @click="expandir" variant="list-header" v-tippy="'Expandir/Colapsar fila'">
          <UIcon name="bi-text-wrap" />
        </BButton>
      </BCol>
    </BRow>
  </BContainer>
</template>

<style scoped lang="scss">
:deep(.btn-list-header) {
  --bs-btn-padding-x: .5rem;
  --bs-btn-padding-y: .25rem;
  --bs-btn-color: var(--bs-gray-700);
  --bs-btn-bg: var(--bs-gray-100);
  --bs-btn-hover-bg: var(--bs-gray-200);
  --bs-btn-active-bg: var(--bs-gray-200);
  --bs-btn-active-border-color: var(--bs-gray-300);
}
</style>