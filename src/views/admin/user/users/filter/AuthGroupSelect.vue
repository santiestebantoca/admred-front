<script setup>
const value = defineModel()
const label = defineModel('label')
const props = defineProps({ disabled: Boolean })

import useStore from '@/stores/admin-users'
import { computed, watch } from 'vue'

const store = useStore().authgroup
const options = computed(() => store.data)
store.get()

watch(value, v => label.value = options.value.find(d => d.id === v)?.role)
</script>

<template>
  <select class="form-select" :disabled="disabled" v-model="value">
    <option :value="undefined">Todos</option>
    <option v-for="{ id, role } in options" :key="id" :value="id" v-text="role" />
  </select>
</template>
