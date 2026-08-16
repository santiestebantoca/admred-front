<script setup>
import useReportStore from '@/stores/report'
import DateRangePicker from '@/components/commons/DateRangePicker.vue'
import useExportCSV from '@/use/useExportCSV'
import { ref, computed, inject, onBeforeUnmount } from 'vue'

const title = inject('page:title')
const report = useReportStore()
const { exportCSV } = useExportCSV()
const form = ref({
  origin: 'dir_adm',
  desde: null,
  hasta: null
})
const data = computed(() => report.consultadas.data)
const loading = computed(() => report.consultadas.loading)
const noData = computed(() => report.consultadas.noData)
function submit() {
  report.consultadas.reset()
  report.consultadas.get(form.value)
}
const exp = () => {
  const fields = [
    'destino as Area_consultada',
    'presentadas as Presentadas',
    'terminadas as Terminadas',
    'efectividad as Eficacia',
    'demoraH as Demora_promedio_HL',
    'demoraDH as Demora_promedio_DL'
  ].join(',')
  exportCSV(fields, data.value)
}
title.value = 'Áreas consultadas'
onBeforeUnmount(() => report.consultadas.reset())
</script>

<template>
  <div class="pt-3">
    <p>Resumen de efectividad de las áreas consultadas. Solicitudes originadas en la VPOR.</p>
    <div class="my-3 py-3 border-top border-bottom">
      <form @submit.prevent>
        <div class="bg-light p-1 text-center mb-3">
          <div class="d-inline-block mx-auto">
            <label class="form-label">Origen de la solicitud</label>
            <select class="form-select" v-model="form.origin">
              <option value="dir_adm">Dirección de Administración de la Red</option>
              <option value="dep_adm">Departamento de Administración</option>
              <option value="dep_pro">Departamento de Planificación y Provisión</option>
              <option value="comb">Las tres anteriores combinadas</option>
            </select>
          </div>
        </div>
        <div class="d-flex flex-wrap gap-3">
          <div>
            <label class="form-label">Presentada</label>
            <DateRangePicker v-model:start="form.desde" v-model:end="form.hasta" />
          </div>
          <div class="hstack align-items-end pt-2">
            <bs-btn @click="submit" color="primary" label="Generar reporte" />
          </div>
        </div>
      </form>
    </div>
    <em v-if="loading" class="text-muted">Cargando...</em>
    <em v-else-if="noData" class="text-muted"></em>
    <template v-else>
      <div class="p-1 hstack justify-content-end">
        <bs-btn-icon flat @click="exp" title="Exportar CSV" icon="filetype-csv" />
      </div>
      <bs-table>
        <template #thead>
          <tr class="">
            <th>Área consultada</th>
            <th>Presentadas</th>
            <th>Terminadas</th>
            <th>Eficacia (%)</th>
            <th>Demora promedio HL</th>
            <th>Demora promedio DL</th>
          </tr>
        </template>

        <template #tbody>
          <tr v-for="_, index in data" :key="index">
            <td v-text="_.destino" />
            <td v-text="_.presentadas" />
            <td v-text="_.terminadas" />
            <td v-text="_.efectividad" />
            <td v-text="_.demoraH" />
            <td v-text="_.demoraDH" />
          </tr>
        </template>
      </bs-table>
    </template>
  </div>
</template>