<script setup>
const error = defineModel('error')
const value = defineModel('value')

import useFolderStore from '@/stores/folder'
import { watch, computed } from 'vue'

const folder = useFolderStore()
const items = computed(() => folder.tramitadores.data)
folder.tramitadores.get()
watch(value, () => error.value = null)
</script>

<template>
  <label class="form-label">Tramitador</label>
  <bs-select :options="items" optionValue="id" optionLabel="name" v-model="value" maxHeight="320px" />
  <div class="small text-danger" v-text="error" />
</template>
