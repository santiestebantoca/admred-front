<script setup>
const props = defineProps({
  up: Boolean,
})

import ListaNav from './ListaNavDrawer.vue'
import AppsMenu from '@/components/features/AppsMenu.vue'
import UserMenu from '@/components/features/UserMenu.vue'
</script>

<template>
  <div class="drawer-content " :class="{ up }">
    <ListaNav />
    <AppsMenu class="mt-auto" />
    <UserMenu />
  </div>
</template>

<style scoped lang="scss">
.drawer-content {
  &.up {
    padding-top: calc(48px + 16px);
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 16px;
    height: 100dvh;
  }

  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;

  :deep(.list-group) {
    .list-group-item {
      --bs-list-group-bg: transparent;
      --bs-list-group-action-hover-bg: rgba(var(--bs-surface-5-rgb), .5);
      --bs-list-group-border-width: 0 !important;
      color: var(--bs-dark);
      border-radius: var(--bs-border-radius-xl);

      &.title {
        font-size: .875em;
        font-weight: 600;
      }
    }
  }
}
</style>