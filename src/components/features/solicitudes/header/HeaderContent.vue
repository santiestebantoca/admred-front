<script lang="ts" setup>
const props = defineProps({
  noLeftButton: Boolean,
  title: { default: "Solicitudes" }
})

import AppsMenu from './AppsMenu.vue'
import Notificaciones from './Notificaciones.vue'
import UserMenu from './UserMenu.vue'
import { inject } from 'vue'

const mobile = inject('app:mobile')
</script>

<template>
  <BNavbar>
    <BRow>
      <BCol cols="auto">
        <template v-if="!noLeftButton">
          <BButton v-if="mobile" variant="navbar" v-tippy="'Abrir menú de la aplicación'" v-b-toggle.drawer-left>
            <UIcon name="bi-list" />
          </BButton>
        </template>
        <BNavbarBrand to="/home">{{ title }}</BNavbarBrand>
      </BCol>
      <BCol>
      </BCol>
      <BCol cols="auto">
        <Notificaciones />
      </BCol>
      <BCol cols="auto" v-if="!mobile">
        <AppsMenu />
      </BCol>
      <BCol cols="auto" v-if="!mobile">
        <UserMenu />
      </BCol>
    </BRow>
  </BNavbar>
</template>

<style scoped>
:deep(.btn-navbar) {
  height: 34px;
  width: 34px;
  --bs-btn-padding-x: .25rem;
  --bs-btn-padding-y: .25rem;
  --bs-btn-color: var(--bs-gray-700);
  --bs-btn-hover-bg: var(--bs-gray-200);
  --bs-btn-active-bg: var(--bs-gray-200);
  --bs-btn-active-border-color: var(--bs-gray-200);

  >img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

:deep(.container-fluid) {
  display: block;
}
</style>