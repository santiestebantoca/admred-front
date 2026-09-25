<script setup>
import { AREAS_AR } from '@/constants/solicitud'
import { formatTime } from '@/composables/useDates'
import DateRangePicker from '@/components/commons/DateRangePicker.vue'
import useExportCSV from '@/composables/useExportCSV'
import { useSolicitudesQuery } from '@/stores/reportes'
import { ref, computed, inject } from 'vue'

const title = inject('page:title')
const { solicitudes, isPending, isLoading, refresh, params } = useSolicitudesQuery()
const { exportCSV } = useExportCSV()
const form = ref({
  desde: undefined,
  hasta: undefined,
  destino_id: undefined
})
const fields = ref([
  { key: 'origen', label: 'De' },
  { key: 'objetivo', label: 'Objetivo' },
  { key: 'solicitado_en', label: 'Presentada', formatter: fechaformatter },
  { key: 'terminado_en', label: 'Terminada', formatter: fechaformatter },
  { key: 'h_objetivo', label: 'H_Objetivo' },
  { key: 'h_solicitado_en', label: 'H_Presentada', formatter: fechaformatter },
  { key: 'h_terminado_en', label: 'H_Terminada', formatter: fechaformatter },
])

title.value = 'Solicitudes'

function fechaformatter({ value }) { return formatTime(value) || '-' }
const submit = () => params.value = { ...form.value }
const exportar = () => {
  const toSave = computed(() => (solicitudes.value || []).map(d => ({
    ...d,
    objetivo: d.objetivo.slice(0, 150),
    h_objetivo: d.h_objetivo?.slice(0, 150),
  })))
  const fields = [
    'codigo',
    'origen',
    'objetivo',
    'solicitado_en as presentada',
    'terminado_en as terminada',
    'tramitador',
    'supervisor',
    'h_codigo',
    'h_destino',
    'h_objetivo',
    'h_solicitado_en as h_presentada',
    'h_terminado_en as h_terminada'
  ].join(',')
  exportCSV(fields, toSave.value)
}
</script>

<template>
  <div class="pt-3">
    <p>Registros brutos de solicitudes con sus solicitudes hijas.</p>
    <div class="p-3 mb-3 border rounded-3 surface-1">
      <BForm @submit.prevent="submit" class="d-flex flex-wrap gap-3">
        <div>
          <label class="form-label">Presentadas en</label>
          <DateRangePicker v-model:start="form.desde" v-model:end="form.hasta" required />
        </div>
        <div>
          <label class="form-label">Presentadas a</label>
          <BFormSelect v-model="form.destino_id" :options="AREAS_AR" required />
        </div>
        <div class="w-100">
          <BButton type="submit" variant="primary" :loading="isLoading">
            Generar reporte
          </BButton>
        </div>
      </BForm>
    </div>
    <div v-if="!isPending" class="mb-4 p-3 border rounded-3">
      <p class="fw-semibold">
        Resultados
        <span class="text-secondary">
          ({{ solicitudes.length }})
        </span>
        <span class="fw-normal mark bg-light px-1 rounded-3 small text-secondary">
          mostrando 10 resultados.
        </span>
        <BButton variant="link" @click="exportar" v-tippy="'Guardar todo como (*.csv)'">
          <IBiSave /> *CSV
        </BButton>
      </p>
      <template v-if="solicitudes.length">
        <BTable :fields="fields" :items="solicitudes.slice(0, 10)" responsive table-class="my-3" />
      </template>
      <div v-else class="py-3 text-center">
        El reporte no devolvió resultados.
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.b-table th) {
  font-size: .875em;
  font-weight: 600;
  line-height: 24px;
}

.btn-link {
  margin: -7px 0;
  float: right;
  position: relative;
  top: -1px;
  --bs-btn-hover-bg: var(--bs-primary-50);
}
</style>