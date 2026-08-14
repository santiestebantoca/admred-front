<script setup>
import useFolderStore from '@/stores/folder'
import { computed } from 'vue'

const folder = useFolderStore()
const periods = computed(() => ([
  { label: '2 semanas', value: undefined, active: !folder.query.period },
  { label: '1 mes', value: '2', active: folder.query.period === '2' },
  { label: '6 meses', value: '3', active: folder.query.period === '3' },
  { label: '1 año', value: '4', active: folder.query.period === '4' }
]))
const label = computed(() => periods.value.find(p => p.active).label)
const query = val => folder.query = { ...folder.query, period: val }
</script>

<template>
  <bs-dropdown>
    <bs-dropdown-toggle>
      <bs-btn :label="label" flat icon="clock-history">
        <bs-btn-caret class="ms-2" />
        <bs-tooltip placement="bottom" offset="30,10">Terminadas en el período</bs-tooltip>
      </bs-btn>
    </bs-dropdown-toggle>
    <bs-dropdown-menu>
      <bs-dropdown-item v-for="{ active, label, value } in periods" :key="value" @click="query(value)">
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
