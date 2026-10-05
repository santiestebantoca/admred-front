<script setup>
const props = defineProps({
  linkSolicitud: Function
})

import { DIRECCION_ADMINISTRACION_ID, NIVELES_AREAS_EXTERNAS, PENDIENTE_TERMINADA } from '@/constants/solicitud'
import { useDemandantesQuery } from '@/stores/demandantes'
import { formatTime } from '@/composables/useDates'
import useExportCSV from '@/composables/useExportCSV'
import { useSolicitudesExternasQuery } from '@/stores/reportes'
import { ref, computed, inject, watchEffect } from 'vue'

const title = inject('reportes:title')
const { origenes, params: origenesParams } = useDemandantesQuery()
const { solicitudes, isPending, isLoading, refresh, params } = useSolicitudesExternasQuery()
const { exportCSV } = useExportCSV({ excelReady: true })
const form = ref({
  desde: null,
  hasta: null,
  origen: null, // áreas externas
  estado: null,
  codigo: null,
  objetivo: null
})
const fields = ref([
  { key: 'codigo', label: 'Código', tdClass: 'td-codigo' },
  { key: 'origen', label: 'De' },
  { key: 'objetivo', label: 'Objetivo' },
  { key: 'solicitado_en', label: 'Presentada', formatter: fechaformatter },
  { key: 'terminado_en', label: 'Terminada', formatter: fechaformatter },
  { key: 'estado', label: 'Estado' },
  { key: 'related', label: 'Solicitudes hijas' },
])

title.value = 'Solicitudes a la VPOR'
watchEffect(() => origenesParams.value = {
  desde: form.value.desde,
  hasta: form.value.hasta,
  destino_id: DIRECCION_ADMINISTRACION_ID,
  origen_nivel: NIVELES_AREAS_EXTERNAS
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
    <p>Solicitudes de áreas externas a la VPOR, presentadas a la Dirección de Administración de la Red.</p>
    <div class="p-3 mb-3 border rounded-3 surface-1">
      <BForm @submit.prevent="submit" class="d-flex flex-wrap gap-3">
        <div>
          <label class="form-label">Presentadas en</label>
          <DateRangePicker v-model:start="form.desde" v-model:end="form.hasta" required />
        </div>
        <div class="w-100 maxw-500">
          <label class="form-label">Área demandante</label>
          <BFormSelect v-model="form.origen" :options="origenes" :disabled="!form.desde">
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
</style>