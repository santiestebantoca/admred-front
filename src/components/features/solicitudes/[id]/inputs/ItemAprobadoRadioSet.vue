<script setup>
const error = defineModel('error')
const value = defineModel('value')

import { watch } from 'vue'

watch(value, () => error.value = null)
</script>

<template>
  <div>
    <div class="form-check mb-3">
      <input type="radio" class="form-check-input" value="1" v-model="value">
      <label class="form-check-label mx-2" for="aprobado">Aprobar respuesta del tramitador</label>
    </div>
    <div class="form-check mb-3">
      <input type="radio" class="form-check-input" value="0" v-model="value">
      <label class="form-check-label mx-2" for="desaprobado">Desaprobar respuesta del tramitador</label>
    </div>
    <div class="small text-danger ps-1" v-text="error"></div>
  </div>
</template>
