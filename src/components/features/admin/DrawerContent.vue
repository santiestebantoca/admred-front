<script setup>
const props = defineProps({
  up: Boolean,
})

import ListaNav from './ListaNavDrawer.vue'
import AppsMenu from '@/components/features/AppsMenu.vue'
import UserMenu from '@/components/features/UserMenu.vue'

// const props = defineProps({ down: Boolean })

// import UserMenu from '@/components/features/UserMenu.vue'
// import AppsMenu from '@/components/features/AppsMenu.vue'
// import useNavOptions from './base/nav'

// const nav = useNavOptions().options
</script>

<template>
  <div class="drawer-content " :class="{ up }">
    <ListaNav />
    <AppsMenu class="mt-auto" />
    <UserMenu />
  </div>
  <!-- <div class="h-100 d-flex flex-column bg-light-1 overflow-auto gap-1 pb-4">
    <bs-btn-close v-if="down" @click="$emit('hide')" class="m-1 ms-auto" />
    <h5 v-else class="p-3 mb-3">Administración</h5>
    <div class="px-1">
      <bs-btn v-for="_ in nav" flat color="primary" :to="_.to" @click="$emit('hide')" class="w-100 text-start">
        <i :class="`bi-${_.icon}`" class="me-3" />
        <span v-text="_.label" />
      </bs-btn>
    </div>
    <div class="m-auto" />
    <div class="border-bottom" />
    <div class="px-1">
      <AppsMenu />
    </div>
    <div class="border-bottom" />
    <UserMenu class="px-1" />
  </div> -->
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