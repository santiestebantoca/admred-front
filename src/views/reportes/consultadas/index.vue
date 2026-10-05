<script setup>
import { DIRECCION_ADMINISTRACION_ID, AREAS_AR, CURSO_SOLICITUD } from '@/constants/solicitud'
import useExportCSV from '@/composables/useExportCSV'
import { useAreasConsultadasQuery } from '@/stores/reportes'
import { ref, inject } from 'vue'

const title = inject('reportes:title')
const { areas, isLoading, isPending, params } = useAreasConsultadasQuery()
const { exportCSV } = useExportCSV({ excelReady: true })
const form = ref({
  desde: null,
  hasta: null,
  origen: DIRECCION_ADMINISTRACION_ID, // áreas AR u otras de la VPOR
  curso: 1
})
const fields = ref([
  { key: 'destino', label: 'Área consultada' },
  { key: 'presentadas', label: 'Presentadas' },
  { key: 'terminadas', label: 'Terminadas' },
  { key: 'efectividad', label: 'Eficacia (%)' },
  { key: 'demoraH', label: 'Demora promedio HL' },
  { key: 'demoraDH', label: 'Demora promedio DL' },
])

title.value = 'Áreas consultadas'

const submit = () => params.value = { ...form.value }
const exportar = () => {
  const fields = [
    'destino as Area_consultada',
    'presentadas as Presentadas',
    'terminadas as Terminadas',
    'efectividad as Eficacia',
    'demoraH as Demora_promedio_HL',
    'demoraDH as Demora_promedio_DL'
  ].join(',')
  exportCSV(fields, areas.value)
}
</script>

<template>
  <div class="pt-3">
    <p>Resumen de efectividad de las áreas consultadas.</p>
    <div class="p-3 mb-3 border rounded-3 surface-1">
      <BForm @submit.prevent="submit" class="d-flex flex-wrap gap-3">
        <div>
          <label class="form-label">Origen de la solicitud</label>
          <BFormSelect v-model="form.origen" :options="AREAS_AR" class="w-auto">
            <BFormSelectOption :value="null">Los tres origenes anteriores combinados</BFormSelectOption>
          </BFormSelect>
        </div>
        <div>
          <label class="form-label">Curso de origen</label>
          <BFormSelect v-model="form.curso" :options="CURSO_SOLICITUD" class="w-auto">
            <BFormSelectOption :value="null">Cualquiera</BFormSelectOption>
          </BFormSelect>
        </div>
        <div class="w-100" />
        <div>
          <label class="form-label">Presentadas en</label>
          <DateRangePicker v-model:start="form.desde" v-model:end="form.hasta" required />
        </div>
        <div>
          <label class="form-label invisible">Generar reporte</label>
          <BButton type="submit" variant="primary d-block" :loading="isLoading">
            Generar reporte
          </BButton>
        </div>
      </BForm>
    </div>
    <div v-if="!isLoading && !isPending" class="mb-4 p-3 border rounded-3">
      <p class="fw-semibold resultados">
        Resultados
        <span class="text-secondary">
          ({{ areas?.length }})
        </span>
        <BButton variant="link" @click="exportar" v-tippy="'Guardar todo como (*.csv)'">
          <IBiSave /> *CSV
        </BButton>
      </p>
      <template v-if="areas?.length">
        <BTable :fields="fields" :items="areas" responsive table-class="my-3 tr-last-bold" />
      </template>
      <div v-else class="py-3 text-center">
        El reporte no devolvió resultados.
      </div>
    </div>
  </div>
</template>

<style scoped>
.maxw-500 {
  max-width: 500px;
}

.w-130 {
  width: 130px;
}

.mw-300 {
  min-width: 300px;
}

:deep(.b-table th) {
  font-size: .875em;
  font-weight: 600;
  line-height: 24px;
}

:deep(.tr-last-bold) {
  tr:last-child {
    font-weight: 600;
  }
}

.resultados .btn-link {
  margin: -7px 0;
  float: right;
  position: relative;
  top: -1px;
  --bs-btn-hover-bg: var(--bs-primary-50);
}

:deep(.td-codigo) {
  padding: 0;

  .btn {
    white-space: nowrap;
    position: relative;
    top: 1px;
  }
}

.with-info {
  text-decoration: underline dotted;
  text-underline-offset: 3px;
  cursor: help;
}
</style>