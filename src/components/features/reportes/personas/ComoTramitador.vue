<script setup>
const props = defineProps({
  data: Object
})

import { formatTime } from '@/composables/useDates'
import { ref, computed } from 'vue'

const fields = ref([
  { key: 'codigo', label: '', tdClass: 'td-codigo' },
  { key: 'tramitador_en', label: 'Asignada', formatter: fechaformatter },
  { key: 'hijo_en', label: 'Reenviada', formatter: fechaformatter },
  { key: 'demoraReenvioDH', label: 'Demora Reenvío' },
  { key: 'hijo_terminado_en', label: 'Respuesta reenvíos', formatter: fechaformatter },
  { key: 'respuesta_en', label: 'Respuesta tramitador', formatter: fechaformatter },
  { key: 'demoraRespuestaDH', label: 'Demora Respuesta' },
  { key: 'demoraTramitadorDH', label: 'Demora del tramitador', variant: 'danger' },
])
const resumen = computed(() => ([
  { text: 'Asignadas', value: props.data.resumen.value.asignadas },
  { text: 'Terminadas', value: props.data.resumen.value.terminadas },
  { text: 'Demora promedio del tramitador', value: props.data.resumen.value.demoraDH },
]))

function fechaformatter({ value }) { return formatTime(value) || '-' }
</script>

<template>
  <p class="fw-semibold">Como tramitador</p>
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