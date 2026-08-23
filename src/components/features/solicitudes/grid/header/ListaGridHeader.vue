<script setup>
import ListaSearch from './ListaSearch.vue'
import ListaPeriod from './ListaPeriod.vue'
import ListaStatus from './ListaStatus.vue'
import { useSolicitudesQuery } from '@/stores/solicitudes'
import useExportCSV from '@/composables/useExportCSV.js'
import { inject } from 'vue'

const mobile = inject('app:mobile')
const params = inject('solicitudes:params')
const { solicitudes, refresh } = useSolicitudesQuery()
const { exportCSV } = useExportCSV()

const exportar = () => {
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

</script>

<template>
  <BContainer fluid :class="[mobile ? 'py-1' : 'py-2']">
    <BRow>
      <BCol cols="auto">
        <ListaPeriod v-if="params.state === 'terminadas'" />
        <ListaStatus v-else-if="params.state === 'pendientes'" />
      </BCol>
      <BCol></BCol>
      <BCol v-if="!mobile" cols="auto">
        <ListaSearch style="width:360px" />
      </BCol>
      <BCol cols="auto">
        <BButton @click="refresh" variant="list-header" v-tippy="'Actualizar'">
          <UIcon name="bi-arrow-repeat" />
        </BButton>
      </BCol>
      <BCol cols="auto">
        <BButton @click="exportar" variant="list-header" v-tippy="'Exportar (*.csv)'">
          <UIcon name="bi-filetype-csv" />
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