<script setup>
const error = defineModel('error')
const value = defineModel('value')

import { watch } from 'vue'

watch(value, () => error.value = null)
</script>

<template>
  <div>
    <label for="lastNameInput" class="form-label">Apellidos</label>
    <input v-model="value" class="form-control" id="lastNameInput" />
    <div class="small text-danger" v-text="error" />
  </div>
</template>
