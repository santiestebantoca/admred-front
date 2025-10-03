<script setup>
const value = defineModel()
const label = defineModel('label')

import useStore from '@/stores/admin-areas'
import { computed, watch } from 'vue'

const store = useStore().niveles
const options = computed(() => store.data)
store.get()
watch(value, v => label.value = options.value.find(d => d.id === v)?.nombre)
</script>

<template>
  <select class="form-select" v-model="value">
    <option :value="undefined">Todos</option>
    <option v-for="{ id, nombre } in options" :key="id" :value="id" v-text="nombre" />
  </select>
</template>
