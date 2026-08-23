<script setup>
const error = defineModel('error')
const value = defineModel('value')

import { watch } from 'vue'

watch(value, () => error.value = null)
</script>

<template>
  <div class="position-relative mb-3">
    <textarea v-model="value" class="form-control px-1 border-0 shadow-none" rows="8"
      style="resize:none;overflow-y: auto" placeholder="Objetivo o alcance de la demanda" />
    <div class="small text-danger position-absolute top-0 start-0 ps-1 mt-4 pt-3" v-text="error" />
  </div>
</template>
