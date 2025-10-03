<script setup>
import useReportStore from '@/stores/report'
import { formatTime } from '@/use/useDates'
import { ref, computed } from 'vue'

const report = useReportStore()
const fields = ref([
  'Presentada',
  'Asignada',
  'Demora Asignación',
  'Respuesta tramitador',
  'Evaluada',
  'Demora Evaluación',
  'Demora del supervisor',
])
const data = computed(() => report.person.solicitudes.asSupervisor.data)
const resume = computed(() => report.person.solicitudes.asSupervisor.resume)
const resumeItems = computed(() => ([
  { title: 'Supervisadas', value: resume.value.supervisadas },
  { title: 'Terminadas', value: resume.value.terminadas },
  { title: 'Demora promedio del supervisor', value: resume.value.demoraDH },
]))
</script>

<template>
  <div v-if="data?.length">
    <h5 class="hstack fw-semibold mb-4 gap-3 pt-2">
      <small>Como supervisor</small>
    </h5>
    <div class="p-3 border rounded">
      <div class="hstack mb-3">
        <ul class="list-group">
          <li class="list-group-item hstack justify-content-between" v-for="item, index in resumeItems" :key="index">
            <span v-text="item.title" />
            <span class="text-end ps-5" v-text="item.value" />
          </li>
        </ul>
      </div>
      <div class="overflow-auto">
        <bs-table>
          <template #colgroup>
            <col />
            <col span="7" style="min-width:150px" />
          </template>
          <template #thead>
            <tr>
              <th></th>
              <th v-for="field, index in fields" :key="index" v-text="field" />
            </tr>
          </template>
          <template #tbody>
            <tr v-for="row in data" :key="row.id">
              <td>
                <mark v-if="row.terminado_en" class="text-bg-info">T</mark>
                <mark v-else class="text-bg-warning">P</mark>
                &nbsp;
                <router-link :to="{ query: { item: row.id } }">
                  {{ row.codigo }}
                </router-link>
              </td>
              <td>{{ formatTime(row.solicitado_en) }}</td>
              <td>{{ formatTime(row.tramitador_en) }}</td>
              <td>{{ row.demoraAsignacionDH }}</td>
              <td>{{ formatTime(row.respuesta_en) || '-' }}</td>
              <td>{{ formatTime(row.terminado_en) || '-' }}</td>
              <td>{{ row.demoraEvaluacionDH }}</td>
              <td>{{ row.demoraSupervisorDH }}</td>
            </tr>
          </template>
        </bs-table>
      </div>
    </div>
  </div>
</template>
