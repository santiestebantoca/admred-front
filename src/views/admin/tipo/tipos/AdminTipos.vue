<script setup>
const props = defineProps({ grid: Boolean, newItem: Function, linkItem: Function })

import TiposFilter from './TiposFilter.vue'
import TiposGrid from './TiposGrid.vue'
import useStore from '@/stores/admin-tipos'
import { onUnmounted } from 'vue'

const store = useStore().tipos
store.get()
onUnmounted(store.$reset)
</script>

<template>
  <div>
    <TiposFilter v-show="grid" style="max-width: 500px" class="mb-3" />
    <TiposGrid v-show="grid" @rowClick="linkItem" @new="newItem" />
    <router-view />
  </div>
</template>
