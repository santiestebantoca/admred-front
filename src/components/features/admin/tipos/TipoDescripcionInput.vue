<script setup>
const value = defineModel('value')
const error = defineModel('error')

import { watch } from 'vue'

watch(value, () => error.value = null)
</script>

<template>
  <div>
    <label for="descTextarea" class="form-label"> Descripción </label>
    <textarea v-model="value" class="form-control" id="descTextarea" />
    <div class="small text-danger" v-text="error" />
  </div>
</template>
