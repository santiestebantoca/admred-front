<script setup>
import HeaderSearch from './HeaderSearch.vue'
import HeaderPeriod from './HeaderPeriod.vue'
import HeaderState from './HeaderState.vue'
import useFolderStore from '@/stores/folder'
import useExportCSV from '@/use/useExportCSV'
import { inject } from 'vue'

const params = inject('folder:params')
const mobile = inject('app:mobile')
const folder = useFolderStore()
const { exportCSV } = useExportCSV()

const actualizar = () => {
  folder.get()
  folder.pending.get()
}
const save = () => {
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
  exportCSV(fields, folder.data)
}

</script>

<template>
  <div class="d-flex hstack" :class="[mobile ? 'p-1' : 'p-2']">
    <HeaderPeriod v-if="params.state === 'terminadas'" />
    <HeaderState v-else />
    <template v-if="!mobile">
      <HeaderSearch class="ms-auto me-2" />
      <bs-btn-icon @click="actualizar" flat icon="arrow-repeat" style="font-size:1.3em">
        <bs-tooltip placement="bottom" offset="0,10">Actualizar</bs-tooltip>
      </bs-btn-icon>
      <bs-btn-icon @click="save" flat icon="filetype-csv" style="font-size:1.3em">
        <bs-tooltip placement="bottom" offset="0,10">Exportar (*.csv)</bs-tooltip>
      </bs-btn-icon>
    </template>
  </div>
</template>