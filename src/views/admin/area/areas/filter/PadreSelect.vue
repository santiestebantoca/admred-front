<script setup>
const value = defineModel()
const label = defineModel('label')
const props = defineProps({ nivel: Number })

import useStore from '@/stores/admin-areas'
import { ref, computed, watch, watchEffect, inject } from 'vue'

const loading = inject('app:loading')
const store = useStore().padres
const items = computed(() => store.data)
watch(() => store.status.loading, val => loading.value = val)
watch(() => props.nivel, val => {
  value.value = null
  store.query = { nivel: val }
})
watch(value, v => label.value = items.value.find(d => d.id === v)?.nombre)
//
const disabled = ref(false)
watchEffect(() => disabled.value = items.value.length < 2)
</script>

<template>
  <select class="form-select" v-model="value" :disabled="disabled">
    <option :value="null">Todas</option>
    <option v-for="{ id, nombre } in items" :key="id" :value="id" v-text="nombre" />
  </select>
</template>
