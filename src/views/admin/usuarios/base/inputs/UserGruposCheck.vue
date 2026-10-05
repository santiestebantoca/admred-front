<script setup>
const error = defineModel('error')
const value = defineModel('value', { default: [] })

import useStore from '@/stores/admin-users'
import { watch, computed } from 'vue'

const store = useStore().authgroup
const items = computed(() => store.data)
store.get()

watch(value, () => error.value = null)
</script>

<template>
  <div>
    <label class="form-label">Grupos</label>
    <div class="p-2 rounded border overflow-auto">
      <bs-checkbox v-for="{ id, role, description } in items" :key="id" :value="id" v-model="value"
        :label="role.charAt(0).toUpperCase() + role.slice(1)" :caption="description" />
    </div>
    <div class="small text-danger" v-text="error" />
  </div>
</template>

<style scoped></style>
