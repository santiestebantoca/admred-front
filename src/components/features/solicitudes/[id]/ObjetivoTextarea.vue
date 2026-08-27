<script setup>
const error = defineModel('error')
const value = defineModel('value')

import { watch } from 'vue'

watch(value, () => error.value = null)
</script>

<template>
  <div class="position-relative mb-3">
    <BFormTextarea v-model="value" no-resize placeholder="Objetivo o alcance de la demanda" rows="8" />
    <div class="small text-danger position-absolute top-0 start-0 ps-1 mt-4 pt-3" v-text="error" />
  </div>
</template>

<style scoped lang="scss">
:deep(textarea) {
  border: none;

  &:focus {
    box-shadow: none !important;
  }
}
</style>