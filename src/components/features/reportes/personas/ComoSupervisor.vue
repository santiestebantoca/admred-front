<script setup>
const props = defineProps({
  data: Object
})

import { formatTime } from '@/composables/useDates'
import { ref, computed } from 'vue'

const fields = ref([
  { key: 'codigo', label: '', tdClass: 'td-codigo' },
  { key: 'solicitado_en', label: 'Presentada', formatter: fechaformatter },
  { key: 'tramitador_en', label: 'Asignada', formatter: fechaformatter },
  { key: 'demoraAsignacionDH', label: 'Demora Asignación' },
  { key: 'respuesta_en', label: 'Respuesta tramitador', formatter: fechaformatter },
  { key: 'terminado_en', label: 'Evaluada', formatter: fechaformatter },
  { key: 'demoraEvaluacionDH', label: 'Demora Evaluación' },
  { key: 'demoraSupervisorDH', label: 'Demora del supervisor', variant: 'danger' },
])
const resumen = computed(() => ([
  { text: 'Supervisadas', value: props.data.resumen.value.supervisadas },
  { text: 'Terminadas', value: props.data.resumen.value.terminadas },
  { text: 'Demora promedio del supervisor', value: props.data.resumen.value.demoraDH },
]))

function fechaformatter({ value }) { return formatTime(value) || '-' }
</script>

<template>
  <p class="fw-semibold">Como supervisor</p>
  <BListGroup>
    <BListGroupItem v-for="{ text, value } in resumen">
      {{ text }}
      <span class="float-end ps-5">{{ value }}</span>
    </BListGroupItem>
  </BListGroup>
  <BTable :fields="fields" :items="props.data.data.value" responsive table-class="my-3">
    <template #cell(codigo)="{ item }">
      <BButton :to="{ query: { item: item.id } }" variant="link">
        <IBiCheck2 v-if="item.terminado_en" class="text-bg-info mark rounded-2" v-tippy="'Terminada'" />
        <IBiClock v-else class="text-bg-warning mark rounded-2" v-tippy="'Pendiente'" />
        {{ item.codigo }}
      </BButton>
    </template>
  </BTable>
</template>

<style scoped lang="scss">
.list-group {
  max-width: fit-content;
  --bs-list-group-bg: var(--bs-surface-1);
}

:deep(.b-table th) {
  font-size: .875em;
  font-weight: 600;
  line-height: 24px;
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