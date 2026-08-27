<script setup>
import { computed, inject } from 'vue'

const query = inject('solicitudes:query')
const periods = computed(() => ([
  { label: '2 semanas', to: { query: { period: undefined } }, highlighted: query.value.period === undefined },
  { label: '1 mes', to: { query: { period: 2 } }, highlighted: query.value.period === '2' },
  { label: '6 meses', to: { query: { period: 3 } }, highlighted: query.value.period === '3' },
  { label: '1 año', to: { query: { period: 4 } }, highlighted: query.value.period === '4' }
]))
const label = computed(() => periods.value.find(d => d.highlighted).label)
</script>

<template>
  <BDropdown :text="label" v-tippy="'Terminadas en el período'" variant="list-header">
    <BDropdownItem v-for="{ label, to, highlighted } in periods" :to="to" :class="{ highlighted }">
      {{ label }}
    </BDropdownItem>
  </BDropdown>
</template>