<script setup>
const value = defineModel()
const label = defineModel('label')
const props = defineProps({ disabled: Boolean })

import useStore from '@/stores/admin-users'
import { ref, computed, watch } from 'vue'

const store = useStore().areas
const oneOption = ref(null)
const options = computed(() => store.data)
store.get()
watch(value, v => label.value = options.value.find(d => d.id === v)?.nombre)
//
// special case of one option
watch(options, ops => oneOption.value = ops?.length === 1, { immediate: true })
watch(oneOption, v => v && (value.value = options.value[0].id), { immediate: true })
</script>

<template>
  <select class="form-select" :disabled="disabled || oneOption" v-model="value">
    <option :value="undefined">Todas</option>
    <option v-for="{ id, nombre } in options" :key="id" :value="id" v-text="nombre" />
  </select>
</template>
