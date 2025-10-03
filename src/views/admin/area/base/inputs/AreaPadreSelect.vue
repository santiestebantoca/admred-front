<script setup>
const value = defineModel('value')
const error = defineModel('error')
const disabled = defineModel('disabled')
const props = defineProps({ nivel: Number })

import useStore from '@/stores/admin-areas'
import { computed, watch, watchEffect, inject } from 'vue'

const loading = inject('app:loading')
const store = useStore().padres
const items = computed(() => store.data)
watch(() => store.status.loading, val => loading.value = val)
watch(() => props.nivel, (val, from) => {
  // skip value reset at first (for edit form)
  // immediate for options at first (for edit form)
  if (from) value.value = null
  store.query = { nivel: val }
}, { immediate: true })
//
const oneOption = computed(() => items.value.length === 1, { immediate: true })
watch(oneOption, val => val && (value.value = items.value[0].id), { immediate: true })
watchEffect(() => disabled.value = items.value.length < 2)
watch(value, () => error.value = null)
</script>

<template>
  <div>
    <label for="padreSelect" class="form-label"> Pertenece a </label>
    <select class="form-select" id="padreSelect" v-model="value" :disabled="disabled">
      <option v-for="{ id, nombre } in items" :key="id" :value="id" v-text="nombre" />
    </select>
    <div class="small text-danger" v-text="error"></div>
  </div>
</template>
