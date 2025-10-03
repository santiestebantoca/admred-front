<script setup>
const error = defineModel('error')
const value = defineModel('value')

import { watch } from 'vue'

watch(value, () => error.value = null)
</script>

<template>
  <div>
    <label for="usernameInput" class="form-label">Nombre de usuario</label>
    <input v-model="value" class="form-control" id="usernameInput" />
    <div class="small text-danger" v-text="error" />
  </div>
</template>
