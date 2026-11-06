<script lang="ts" setup>
import { formatTime } from '@/composables/useDates'
import type { ReportePersonaRow } from '@/types/api'
import type { TableFieldRaw } from 'bootstrap-vue-next'
import type { RouteLocationRaw } from 'vue-router'
import { ref, computed, type Ref } from 'vue'

type FilaTramitador = ReportePersonaRow & {
  demoraReenvio: number
  demoraRespuesta: number
  demoraTramitador: number
  demoraReenvioDH: string
  demoraRespuestaDH: string
  demoraTramitadorDH: string
}

type ResumenTramitador = {
  asignadas: number
  terminadas: number
  demora: number
  demoraDH: string
}

const props = defineProps<{
  data: {
    data: Ref<FilaTramitador[]>
    resumen: Ref<ResumenTramitador>
  }
  linkSolicitud?: (solicitudId: number) => RouteLocationRaw
}>()

const fields: TableFieldRaw<FilaTramitador>[] = [
  { key: 'codigo', label: '', tdClass: 'td-codigo' },
  { key: 'tramitador_en', label: 'Asignada', formatter: fechaformatter },
  { key: 'hijo_en', label: 'Reenviada', formatter: fechaformatter },
  { key: 'demoraReenvioDH', label: 'Demora Reenvío' },
  { key: 'hijo_terminado_en', label: 'Respuesta reenvíos', formatter: fechaformatter },
  { key: 'respuesta_en', label: 'Respuesta tramitador', formatter: fechaformatter },
  { key: 'demoraRespuestaDH', label: 'Demora Respuesta' },
  { key: 'demoraTramitadorDH', label: 'Demora del tramitador', variant: 'danger' },
]
const resumen = computed(() => ([
  { text: 'Asignadas', value: props.data.resumen.value.asignadas },
  { text: 'Terminadas', value: props.data.resumen.value.terminadas },
  { text: 'Demora promedio del tramitador', value: props.data.resumen.value.demoraDH },
]))

function fechaformatter({ value }: { value: unknown }) {
  return formatTime(value as string) || '-'
}
</script>

<template>
  <!-- <p class="fw-semibold">Como tramitador</p> -->
  <BListGroup class="mt-4">
    <BListGroupItem v-for="{ text, value } in resumen">
      {{ text }}
      <span class="float-end ps-5">{{ value }}</span>
    </BListGroupItem>
  </BListGroup>
  <BTable :fields="fields" :items="props.data.data.value" responsive table-class="my-3">
    <template #cell(codigo)="{ item }">
      <BButton :to="linkSolicitud(item.id)" variant="link">
        <ILucideCheck v-if="item.terminado_en" class="text-bg-info mark rounded-2" v-tippy="'Terminada'" />
        <ILucideClock v-else class="text-bg-warning mark rounded-2" v-tippy="'Pendiente'" />
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