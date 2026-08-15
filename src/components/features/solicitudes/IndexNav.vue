<script setup>
import UserDropdown from '@/views/app/widgets/user/Dropdown.vue'
import AppsDropdown from '@/views/app/widgets/apps/Dropdown.vue'
import Notifications from '@/views/app/widgets/notifications/Dialog.vue'
import { inject } from 'vue'

const mobile = inject('app:mobile')
</script>

<template>
  <nav class="navbar">
    <div class="container-fluid gap-1">
      <slot />
      <span class="navbar-brand px-xl-2">Solicitudes</span>
      <span class="ms-auto" />
      <Notifications />
      <template v-if="!mobile">
        <AppsDropdown />
        <UserDropdown />
      </template>
    </div>
  </nav>
</template>
<style scoped>
.header {
  --header-px: 4px;
  --header-height: 44px;
  --header-title-font-size: 1em;
  --header-title-font-weight: 600;
  padding-left: var(--header-px);
  padding-right: var(--header-px);
  height: var(--header-height);
  display: flex;
  align-items: center;
  gap: 4px;
}

.header:not(.mobile) {
  --header-px: 20px;
  --header-height: 48px;
  --header-title-font-size: 1.25em;
  --header-title-font-weight: normal;
}

.header-title {
  font-weight: var(--header-title-font-weight);
  font-size: var(--header-title-font-size);
  /* color: var(--bs-gray-700); */
}
</style> -->