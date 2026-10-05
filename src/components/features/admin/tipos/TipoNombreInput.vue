<script setup>
const value = defineModel('value')
const error = defineModel('error')

import { watch } from 'vue'

watch(value, () => error.value = null)
</script>

<template>
  <div>
    <label for="nombreInput" class="form-label"> Nombre </label>
    <input v-model="value" class="form-control" id="nombreInput" />
    <div class="small text-danger" v-text="error" />
  </div>
</template>
