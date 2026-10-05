<script setup>
const props = defineProps({
  linkSolicitud: Function
})

import { DIRECCION_ADMINISTRACION_ID, AREAS_AR, PENDIENTE_TERMINADA, NIVELES_AREAS_INTERNAS } from '@/constants/solicitud'
import { useConsultadasQuery } from '@/stores/consultadas'
import { formatTime } from '@/composables/useDates'
import useExportCSV from '@/composables/useExportCSV'
import { useSolicitudesInternasQuery } from '@/stores/reportes'
import { ref, computed, inject, watchEffect } from 'vue'

const title = inject('reportes:title')
const { destinos, params: destinosParams } = useConsultadasQuery()
const { solicitudes, isPending, isLoading, refresh, params } = useSolicitudesInternasQuery()
const { exportCSV } = useExportCSV({ excelReady: true })
const form = ref({
  desde: null,
  hasta: null,
  origen: DIRECCION_ADMINISTRACION_ID, // áreas AR u otras de la VPOR
  estado: null,
  codigo: null,
  objetivo: null,
  destino: null, // todas las área, acotadas por el origen (id o nivel VPOR) en el período
})
const fields = ref([
  { key: 'codigo', label: 'Código', tdClass: 'td-codigo' },
  { key: 'origen', label: 'De' },
  { key: 'destino', label: 'Área consultada' },
  { key: 'objetivo', label: 'Objetivo' },
  { key: 'solicitado_en', label: 'Presentada', formatter: fechaformatter },
  { key: 'terminado_en', label: 'Terminada', formatter: fechaformatter },
  { key: 'estado', label: 'Estado' },
  { key: 'related', label: 'Solicitudes hijas' },
])

title.value = 'Solicitudes de la VPOR'
watchEffect(() => destinosParams.value = {
  desde: form.value.desde,
  hasta: form.value.hasta,
  origen_id: form.value.origen,
  origen_nivel: NIVELES_AREAS_INTERNAS
})

function fechaformatter({ value }) { return formatTime(value) || '-' }
const submit = () => params.value = { ...form.value }
const exportar = () => {
  const toString = val =>
    val.map(d => [d.codigo, d.estado, '\nDe:', d.origen, '\nA:', d.destino].join(' ')).join('\n')
  const toSave = computed(() => (solicitudes.value || []).map(d => ({
    ...d,
    objetivo: d.objetivo.slice(0, 150),
    hijas: toString(d.related)
  })))
  const fields = [
    'codigo as Codigo',
    'origen as Area_demandante',
    'destino as Area_consultada',
    'objetivo as Objetivo',
    'solicitado_en as Presentada',
    'terminado_en as Terminada',
    'estado as Estado',
    'hijas as Solicitudes_hijas'
  ].join(',')
  exportCSV(fields, toSave.value)
}
</script>

<template>
  <div class="pt-3">
    <p>
      Solicitudes
      <span class="with-info" v-tippy="'Solicitudes que no son hijas de ninguna otra'">
        originales
      </span>
      de áreas de la
      <span class="with-info" v-tippy="'Se excluyen áreas de los territorios'">
        VPOR
      </span>.
    </p>
    <div class="p-3 mb-3 border rounded-3 surface-1">
      <BForm @submit.prevent="submit" class="d-flex flex-wrap gap-3">
        <div>
          <label class="form-label">Origen de la solicitud</label>
          <BFormSelect v-model="form.origen" :options="AREAS_AR" class="w-auto">
            <BFormSelectOption :value="null">Otras áreas de la VPOR</BFormSelectOption>
          </BFormSelect>
        </div>
        <div class="w-100" />
        <div>
          <label class="form-label">Presentadas en</label>
          <DateRangePicker v-model:start="form.desde" v-model:end="form.hasta" required />
        </div>
        <div class="w-100 maxw-500">
          <label class="form-label">Área consultada</label>
          <BFormSelect v-model="form.destino" :options="destinos" :disabled="!form.desde">
            <template #first>
              <BFormSelectOption :value="null"></BFormSelectOption>
            </template>
          </BFormSelect>
        </div>
        <div class="w-100" />
        <div>
          <label class="form-label">Estado</label>
          <BFormSelect v-model="form.estado" :options="PENDIENTE_TERMINADA">
            <template #first>
              <BFormSelectOption :value="null"></BFormSelectOption>
            </template>
          </BFormSelect>
        </div>
        <div class="w-130">
          <label class="form-label">Código</label>
          <BFormInput v-model="form.codigo" />
        </div>
        <div class="mw-300">
          <label class="form-label">Objetivo o alcance</label>
          <BFormInput v-model="form.objetivo" />
        </div>
        <div>
          <label class="form-label invisible">Generar reporte</label>
          <BButton type="submit" variant="primary d-block" :loading="isLoading">
            Generar reporte
          </BButton>
        </div>
      </BForm>
    </div>
    <div v-if="!isPending" class="mb-4 p-3 border rounded-3">
      <p class="fw-semibold resultados">
        Resultados
        <span class="text-secondary">
          ({{ solicitudes.length }})
        </span>
        <BButton variant="link" @click="exportar" v-tippy="'Guardar todo como (*.csv)'">
          <IBiSave /> *CSV
        </BButton>
      </p>
      <template v-if="solicitudes.length">
        <BTable :fields="fields" :items="solicitudes" responsive table-class="my-3">
          <template #cell(codigo)="{ item }">
            <BButton :to="linkSolicitud(item.id)" variant="link">
              {{ item.codigo }}
            </BButton>
          </template>
          <template #cell(related)="{ item }">
            <div v-for="sh in item.related" class="text-truncate w-100 mb-2" :key="sh.codigo">
              <router-link :to="linkSolicitud(sh.id)" class="text-decoration-none">
                {{ sh.codigo }}
              </router-link>
              {{ sh.estado }}
              <div>De: {{ sh.origen }}</div>
              <div>A: {{ sh.destino }}</div>
            </div>
          </template>
        </BTable>
      </template>
      <div v-else class="py-3 text-center">
        El reporte no devolvió resultados.
      </div>
    </div>
    <RouterView />
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