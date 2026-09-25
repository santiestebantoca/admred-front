<script setup>
import ListaSearch from './ListaGridHeaderSearch.vue'
import ListaPeriod from './ListaGridHeaderPeriod.vue'
import ListaStatus from './ListaGridHeaderStatus.vue'
import { useSolicitudesQuery } from '@/stores/solicitudes'
import useExportCSV from '@/composables/useExportCSV.js'
import { formatTime } from '@/composables/useDates'
import { inject } from 'vue'

const mobile = inject('app:mobile')
const tray = inject('solicitudes:tray')
const state = inject('solicitudes:state')
const filaExpandida = inject('solicitudes:filaExpandida')
const { solicitudes, refetch } = useSolicitudesQuery()
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
  const fields = [
    'codigo as Codigo',
    'objetivo as Objetivo',
    tray.value === 'recibidas'
      ? 'origen as Demandante'
      : 'destino as Area_consultada',
    'solicitado_en as Presentada',
    state.value === 'pendientes'
      ? 'estado as Estado'
      : 'terminado_en as Terminada',
  ].join(',')
  exportCSV(fields, solicitudes.value)
}

const exportar = () => {
  const dePara = tray.value === 'recibidas' ? 'De' : 'A'
  const columns = [
    { label: '#', value: (f) => f[1] },
    { label: 'Objetivo', value: (f) => f[2] },
    { label: dePara, value: (f) => f[6] },
    ...(state.value === 'pendientes'
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
  <BContainer fluid class="">
    <BRow gutter-x="1">
      <BCol cols="auto" class="me-auto">
        <ListaPeriod v-if="state === 'terminadas'" />
        <ListaStatus v-else-if="state === 'pendientes'" />
      </BCol>
      <BCol v-if="!mobile" cols="auto" class="px-3" style="width:400px">
        <ListaSearch />
      </BCol>
      <BCol v-if="!mobile" cols="auto">
        <BButton @click="refetch" variant="flat wh-34" v-tippy="'Actualizar'">
          <IBiArrowRepeat class="center" />
        </BButton>
      </BCol>
      <BCol cols="auto">
        <BDropdown variant="flat wh-34" no-caret v-tippy="'Menu de la tabla'">
          <template #button-content>
            <IBiThreeDots class="center" />
          </template>
          <BDropdownItemButton @click="exportar">
            <IBiSave />
            Guardar como (*.csv)
          </BDropdownItemButton>
          <BDropdownItemButton @click="expandir">
            <IBiTextWrap />
            Ajuste del texto
          </BDropdownItemButton>
        </BDropdown>
      </BCol>
      <BCol v-if="!mobile" cols="auto">
      </BCol>
    </BRow>
  </BContainer>
</template>

<style scoped lang="scss">
:deep(.dropdown-toggle) {
  --bs-btn-padding-x: 1em;
  --bs-btn-hover-bg: var(--bs-gray-200);
  --bs-btn-active-bg: var(--bs-gray-200);

  &::after {
    margin-left: 1em;
  }
}

:deep(.btn-link),
:deep(input) {
  --bs-border-color: var(--bs-gray-500);
}

.btn-flat {
  color: var(--bs-body-color);
}
</style>