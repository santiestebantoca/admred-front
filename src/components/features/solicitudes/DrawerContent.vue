<script lang="ts" setup>
const props = defineProps({ closeDrawer: Function })

import ListaNav from './ListaNavDrawer.vue'
import AppsMenu from '@/components/features/AppsMenu.vue'
import UserMenu from '@/components/features/UserMenu.vue'
</script>

<template>
  <div class="drawer-content">
    <ListaNav :close="closeDrawer" />
    <AppsMenu class="mt-auto" />
    <UserMenu :close="closeDrawer" />
  </div>
</template>

<style scoped lang="scss">
.drawer-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}
</style>