<script setup>
const value = defineModel('value')
const error = defineModel('error')

import useStore from '@/stores/admin-areas'
import { computed, watch } from 'vue'

const store = useStore().niveles
const items = computed(() => store.data)
store.get()
watch(value, () => error.value = null)
</script>

<template>
  <div>
    <label for="nivelSelect" class="form-label"> Nivel </label>
    <select class="form-select" id="nivelSelect" v-model="value">
      <option v-for="{ id, nombre } in items" :key="id" :value="id" v-text="nombre" />
    </select>
    <div class="small text-danger" v-text="error" />
  </div>
</template>
