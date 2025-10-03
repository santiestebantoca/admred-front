<script setup>
const props = defineProps({ grid: Boolean, newItem: Function, linkItem: Function })

import AreasFilter from './filter/AreasFilter.vue'
import AreasGrid from './AreasGrid.vue'
import useStore from '@/stores/admin-areas'
import { onUnmounted } from 'vue'

const store = useStore().areas
store.get()
onUnmounted(store.$reset)
</script>

<template>
  <div>
    <AreasFilter v-show="grid" style="max-width: 500px" class="mb-3" />
    <AreasGrid v-show="grid" @rowClick="linkItem" @new="newItem" />
    <router-view />
  </div>
</template>
