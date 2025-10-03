<script setup>
const props = defineProps({ id: Number })

import useStore from '@/stores/admin-tipos'
import { computed, inject } from 'vue'

const loading = inject('app:loading')
const store = useStore().tipo
const show = computed(() => store.data?.id === props.id)
loading.value++
store.get(props.id).then(() => loading.value--)
</script>

<template>
  <div v-if="show">
    <router-view />
  </div>
</template>