<script setup>
import useReportStore from '@/stores/report'
import DateRangePicker from '@/components/DateRangePicker.vue'
import useExportCSV from '@/use/useExportCSV'
import { formatTime } from '@/use/useDates'
import { ref, computed, inject, onBeforeUnmount } from 'vue'

const title = inject('page:title')
const report = useReportStore()
const { exportCSV } = useExportCSV()
const form = ref({
  origin: 'dir_adm',
  desde: null,
  hasta: null,
  terminada: null,
  destino: null,
  codigo: null,
  objetivo: null
})
const data = computed(() => report.internas.data)
const loading = computed(() => report.internas.loading)
const noData = computed(() => report.internas.noData)
const areaItems = computed(() => report.internas.areas.data)
report.internas.areas.get()
function submit() {
  report.internas.reset()
  report.internas.get(form.value)
}
const exp = () => {
  const toString = val =>
    val.map(d => [d.codigo, d.estado, '\nDe:', d.origen, '\nA:', d.destino].join(' ')).join('\n')
  const fields = [
    'codigo as Codigo',
    'destino as Area_consultada',
    'objetivo as Objetivo',
    'solicitado_en as Presentada',
    'terminado_en as Terminada',
    'estado as Estado',
    'related as Solicitudes_relacionadas'
  ].join(',')
  const data_ = data.value.map(d => ({
    ...d,
    related: toString(d.related)
  }))
  exportCSV(fields, data_)
}
title.value = 'Solicitudes internas'
onBeforeUnmount(() => report.internas.reset())
</script>

<template>
  <div class="pt-3">
    <p>Solicitudes originadas en la VPOR.</p>
    <div class="my-3 py-3 border-top border-bottom">
      <form @submit.prevent>
        <div class="bg-light p-1 text-center mb-3">
          <div class="d-inline-block mx-auto">
            <label class="form-label">Origen de la solicitud</label>
            <select class="form-select" v-model="form.origin">
              <option value="dir_adm">Dirección de Administración de la Red</option>
              <option value="dep_adm">Departamento de Administración</option>
              <option value="dep_pro">Departamento de Planificación y Provisión</option>
              <option value="other">Otras áreas de la VPOR</option>
            </select>
          </div>
        </div>
        <div class="d-flex flex-wrap gap-3">
          <div>
            <label class="form-label">Presentada</label>
            <DateRangePicker v-model:start="form.desde" v-model:end="form.hasta" />
          </div>
          <div>
            <label class="form-label">Estado</label>
            <select class="form-select" v-model="form.terminada">
              <option selected></option>
              <option value="2">Pendientes</option>
              <option value="1">Terminadas</option>
            </select>
          </div>
          <div>
            <label class="form-label">Área consultada</label>
            <select class="form-select" v-model="form.destino">
              <option selected />
              <option v-for="area in areaItems" :key="area.id" :value="area.id" v-text="area.nombre" />
            </select>
          </div>
          <div style="width: 160px">
            <label class="form-label">No. solicitud</label>
            <input v-model="form.codigo" type="text" class="form-control" />
          </div>
          <div style="width: 400px">
            <label class="form-label">Objetivo o alcance</label>
            <input v-model="form.objetivo" type="text" class="form-control" />
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
        <template #colgroup>
          <col style="width: 110px" />
          <col style="width: 15%" />
          <col style="width: 30%" />
          <col style="width: 120px" />
          <col style="width: 120px" />
          <col style="width: 120px" />
          <col style="" />
        </template>

        <template #thead>
          <tr class="">
            <th>No.</th>
            <th>Área consultada</th>
            <th>Objetivo o alcance</th>
            <th>Presentada</th>
            <th>Terminada</th>
            <th>Estado</th>
            <th>Solicitudes relacionadas</th>
          </tr>
        </template>

        <template #tbody>
          <tr v-for="_ in data" :key="_.codigo">
            <td>
              <router-link :to="{ query: { item: _.id } }" v-text="_.codigo" />
            </td>
            <td v-text="_.destino" />
            <td v-text="_.objetivo" />
            <td v-text="_.formatTime(_.solicitado_en)" />
            <td v-text="_.terminado_en && formatTime(_.terminado_en)" />
            <td v-text="_.estado" />
            <td class="p-0 striped">
              <div v-for="s in _.related" class="text-truncate w-100 p-2" :key="s.codigo">
                <router-link :to="{ query: { item: s.id } }" v-text="s.codigo" />
                <span v-text="s.estado" />
                <div>De: {{ s.origen }}</div>
                <div>A: {{ s.destino }}</div>
              </div>
            </td>
          </tr>
        </template>
      </bs-table>
    </template>
  </div>
</template>

<style scoped>
.form-label {
  font-weight: 600;
  font-size: .875em;
}

.striped>div:nth-of-type(2n+1) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
