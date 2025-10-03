<script setup>
const props = defineProps({ back: Function })

import Actions from './DetailsActions.vue'
import useStore from '@/stores/admin-areas'
import { computed } from 'vue'

const store = useStore().area
const data = computed(() => store.data)
const data_ = computed(() => [
  { label: 'Nombre', value: data.value.nombre },
  { label: 'Nivel', value: data.value.nivel.nombre },
  { label: 'Pertenece a', value: data.value.padre?.nombre || '-' },
  { label: 'Marcada como', value: data.value.rol_key || '-' }
])
</script>

<template>
  <div class="data-box">
    <div class="data-header">
      <bs-btn-back @click="back" />
      <Actions class="ms-auto" />
    </div>
    <div v-for="{ label, value, cls } in data_" :key="value">
      <label v-text="label" class="data-label" />
      <div v-text="value" :class="cls" class="data-value" />
    </div>
    <router-view />
  </div>
</template>
