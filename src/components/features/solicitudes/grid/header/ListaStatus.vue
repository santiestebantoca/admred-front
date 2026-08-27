<script setup>
import { computed, inject } from 'vue'

const query = inject('solicitudes:query')
const status = computed(() => ([
  { label: 'Todas', to: { query: { status: undefined } }, highlighted: query.value.status === undefined },
  { label: 'No atendidas', to: { query: { status: 1 } }, highlighted: query.value.status === '1' },
  { label: 'En proceso', to: { query: { status: 2 } }, highlighted: query.value.status === '2' },
  { label: 'En evaluación', to: { query: { status: 3 } }, highlighted: query.value.status === '3' },
]))
const label = computed(() => status.value.find(d => d.highlighted).label)
</script>

<template>
  <BDropdown :text="label" v-tippy="'Estado pendiente'" variant="list-header">
    <BDropdownItem v-for="{ label, to, highlighted } in status" :to="to" :class="{ highlighted }">
      {{ label }}
    </BDropdownItem>
  </BDropdown>
</template>