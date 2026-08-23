<script setup>
import useReportStore from '@/stores/report'
import DateRangePicker from '@/components/commons/DateRangePicker.vue'
import useExportCSV from '@/composables/useExportCSV'
import { ref, computed, inject, onBeforeUnmount } from 'vue'

const title = inject('page:title')
const report = useReportStore()
const { exportCSV } = useExportCSV()
const form = ref({
  desde: null,
  hasta: null
})
const data = computed(() => report.provision.data)
const loading = computed(() => report.provision.loading)
const noData = computed(() => report.provision.noData)
function submit() {
  report.provision.reset()
  report.provision.get(form.value)
}
/**
    `hija`.`codigo` AS `h_codigo`,
    `h_destino`.`nombre` AS `h_destino`,
    `hija`.`objetivo` AS `h_objetivo`,
    `hija`.`solicitado_en` AS `h_solicitado_en`,
    `hija`.`terminado_en` AS `h_terminado_en`
 */
const exp = () => {
  const fields = [
    'codigo as codigo',
    'origen as origen',
    'objetivo as objetivo',
    'solicitado_en as presentada',
    'terminado_en as terminada',
    'h_codigo as h_codigo',
    'h_destino as h_destino',
    'h_objetivo as h_objetivo',
    'h_solicitado_en as h_presentada',
    'h_terminado_en as h_terminada'
  ].join(',')
  exportCSV(fields, data.value)
}
title.value = 'Solicitudes de provisión'
onBeforeUnmount(() => report.provision.reset())
</script>

<template>
  <div class="pt-3">
    <p>Registros brutos de solicitudes al Departamento de Provisión y sus solicitudes hijas.</p>
    <div class="my-3 py-3 border-top border-bottom">
      <form @submit.prevent>
        <div class="d-flex flex-wrap gap-3">
          <div>
            <label class="form-label">Presentada</label>
            <DateRangePicker v-model:start="form.desde" v-model:end="form.hasta" />
          </div>
          <div class="hstack align-items-end pt-2">
            <bs-btn @click="submit" color="primary" label="Generar reporte" :disabled="!form.desde || !form.hasta" />
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
      <div class="table-responsive">
        <bs-table>
          <template #thead>
            <tr>
              <th>De</th>
              <th>Objetivo</th>
              <th>Presentada</th>
              <th>Terminada</th>
              <th>H_Objetivo</th>
              <th>H_Presentada</th>
              <th>H_Terminada</th>
            </tr>
          </template>

          <template #tbody>
            <tr v-for="_, index in data" :key="index">
              <td v-text="_.origen" />
              <td v-text="_.objetivo" />
              <td v-text="_.solicitado_en" />
              <td v-text="_.terminado_en" />
              <td v-text="_.h_objetivo" />
              <td v-text="_.h_solicitado_en" />
              <td v-text="_.h_terminado_en" />
            </tr>
          </template>
        </bs-table>
      </div>
    </template>
  </div>
</template>