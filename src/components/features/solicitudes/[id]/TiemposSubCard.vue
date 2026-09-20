<script setup>
const props = defineProps({
  solicitud: Object,
})

import { formatTime } from '@/composables/useDates'
import { ref, computed } from 'vue'

const expandido = ref(false)
const fields = ref([
  { key: 'title', tdClass: 'td-thin data' },
  { key: 'value', tdClass: 'td-thin data' }
])
const items = computed(() => [
  {
    title: 'Presentada',
    value: formatTime(props.solicitud.solicitado_en),
  },
  ...props.solicitud.tramitador_en && expandido.value
    ? [{
      title: 'Asignada',
      value: formatTime(props.solicitud.tramitador_en)
    }] : [],
  ...props.solicitud.respuesta_en && expandido.value
    ? [{
      title: 'Respondida',
      value: formatTime(props.solicitud.respuesta_en)
    }] : [],
  ...props.solicitud.terminado_en
    ? [{
      title: 'Terminada',
      value: formatTime(props.solicitud.terminado_en)
    }] : [],
  {
    title: 'Acum. N (L)',
    value: props.solicitud.acumulado + ' (' + props.solicitud.laborable + ')',
    subtotal: true
  }
])
</script>

<template>
  <BTableLite :fields="fields" :items="items" thead-class="d-none" tbody-class="tr-last-bold" table-class="mb-1" />
  <BButton v-if="(solicitud.estado.id > 1) && !expandido" @click="expandido = true" variant="flat w-30 h-20"
    v-tippy="'Ver más'">
    <IBiChevronCompactDown class="center text-secondary small" />
  </BButton>
</template>

<style scoped lang="scss">
:deep(.tr-last-bold) {
  tr:last-child {
    font-weight: 600;
  }
}

:deep(.td-thin) {
  padding: 3px 0;
  border: none;
}
</style>