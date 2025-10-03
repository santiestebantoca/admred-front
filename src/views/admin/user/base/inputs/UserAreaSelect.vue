<script setup>
const error = defineModel('error')
const value = defineModel('value')

import useStore from '@/stores/admin-users'
import { watch, computed } from 'vue'

const store = useStore().areas
const items = computed(() => store.data)
store.get()
watch(value, () => error.value = null)
</script>

<template>
  <div>
    <label for="areaSelect" class="form-label">Pertenece al área</label>
    <select class="form-select" id="areaSelect" v-model="value">
      <option v-for="{ id, nombre } in items" :key="id" :value="id" v-text="nombre" />
    </select>
    <div class="small text-danger" v-text="error" />
  </div>
</template>
