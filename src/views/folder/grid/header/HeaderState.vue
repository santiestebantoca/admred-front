<script setup>
import useFolderStore from '@/stores/folder'
import { computed } from 'vue'

const folder = useFolderStore()
const states = computed(() => ([
  { label: 'Todas', value: undefined, active: !folder.query.stateId },
  { label: 'Solicitadas', value: 1, active: folder.query.stateId === 1 },
  { label: 'En proceso', value: 2, active: folder.query.stateId === 2 },
  { label: 'En evaluación', value: 3, active: folder.query.stateId === 3 }
]))
const label = computed(() => states.value.find(d => d.active)?.label)
const query = val => folder.query = { ...folder.query, stateId: val }
</script>

<template>
  <bs-dropdown>
    <bs-dropdown-toggle>
      <bs-btn :label="label" flat icon="dash-square">
        <bs-btn-caret class="ms-2" />
        <bs-tooltip placement="bottom" offset="30,10">Estado de la solicitud</bs-tooltip>
      </bs-btn>
    </bs-dropdown-toggle>
    <bs-dropdown-menu>
      <bs-dropdown-item v-for="{ active, label, value } in states" :key="value" @click="query(value)">
        <span class="check-text" :class="{ active }" v-text="label" />
      </bs-dropdown-item>
    </bs-dropdown-menu>
  </bs-dropdown>
</template>

<style scoped>
.check-text {
  padding-left: 32px;
  position: relative;
  left: -4px
}

.check-text.active {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>');
  background-repeat: no-repeat;
  background-position: bottom left;
}
</style>
