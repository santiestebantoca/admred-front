<script lang="ts" setup>
import ListaNav from './ListaNavDrawer.vue'
import AppsMenu from '@/components/features/AppsMenu.vue'
import UserMenu from '@/components/features/UserMenu.vue'
</script>

<template>
  <div class="drawer-content">
    <ListaNav />
    <AppsMenu class="mt-auto" />
    <UserMenu />
  </div>
</template>

<style scoped lang="scss">
.drawer-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;

  :deep(.list-group) {
    .list-group-item {
      --bs-list-group-border-width: 0 !important;
      color: var(--bs-dark);
      border-radius: var(--bs-border-radius-xl);

      &.title {
        font-size: .875em;
        color: var(--bs-secondary);
        font-weight: 600;
      }
    }
  }
}
</style>