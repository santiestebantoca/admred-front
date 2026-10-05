<script setup>
const props = defineProps({ id: Number })

import useStore from '@/stores/admin-areas'
import { computed, inject } from 'vue'

const loading = inject('app:loading')
const store = useStore().area
const show = computed(() => store.data?.id === props.id)
loading.value++
store.get(props.id).then(() => loading.value--)
</script>

<template>
  <div v-if="show">
    <router-view />
  </div>
</template>