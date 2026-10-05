<script setup>
const props = defineProps({ back: Function })

import useStore from '@/stores/admin-users'
import { computed } from 'vue'

const store = useStore().user
const data = computed(() => store.data)
const data_ = computed(() => [
  { label: 'Creado por', value: data.value.created_by },
  { label: 'Creado en', value: data.value.created_on },
  { label: 'Modificado por', value: data.value.modified_by },
  { label: 'Modificado en', value: data.value.modified_on }
])
</script>

<template>
  <div class="data-box">
    <div class="data-header">
      <bs-btn-back @click="back" />
      <span class="fs-5">Metadatos</span>
    </div>
    <div v-for="{ label, value } in data_" :key="value">
      <label v-text="label" class="data-label" />
      <div v-text="value" class="data-value" />
    </div>
  </div>
</template>
