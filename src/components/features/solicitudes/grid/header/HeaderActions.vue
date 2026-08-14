<script setup>
import useFolderStore from '@/stores/folder'
import useExportCSV from '@/use/useExportCSV'
import { ref, inject } from 'vue'

const params = inject('folder:params')
const folder = useFolderStore()
const { exportCSV } = useExportCSV()
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
const carousel = ref(0)
</script>

<template>
  <bs-dropdown>
    <bs-dropdown-toggle @hidden="carousel = 0">
      <bs-btn-icon icon="three-dots-vertical" flat>
        <bs-tooltip placement="bottom" offset="0,10">Más</bs-tooltip>
      </bs-btn-icon>
    </bs-dropdown-toggle>
    <bs-dropdown-menu style="min-width:240px" tag="div">
      <bs-carousel v-model="carousel">
        <bs-carousel-item>
          <bs-dropdown-item icon="save" label="Guardar como" @click.stop="carousel = 1">
            <bs-icon name="chevron-right" class="ms-auto" />
          </bs-dropdown-item>
        </bs-carousel-item>
        <bs-carousel-item>
          <bs-dropdown-item variant="carousel-title" label="Guardar como" @click.stop @back="carousel--" />
          <bs-dropdown-item icon="filetype-csv" label="Archivo CSV (*.csv)" @click="save" />
        </bs-carousel-item>
      </bs-carousel>
    </bs-dropdown-menu>
  </bs-dropdown>
</template>
