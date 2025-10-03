<script setup>
const props = defineProps({ grid: Boolean, newItem: Function, linkItem: Function })

import UsersFilter from './filter/UsersFilter.vue'
import UsersGrid from './UsersGrid.vue'
import useStore from '@/stores/admin-users'
import { onUnmounted } from 'vue'

const store = useStore().users
store.get()
onUnmounted(store.$reset)
</script>

<template>
  <div>
    <UsersFilter v-show="grid" style="max-width: 500px" class="mb-3" />
    <UsersGrid v-show="grid" @rowClick="linkItem" @new="newItem" />
    <router-view />
  </div>
</template>
