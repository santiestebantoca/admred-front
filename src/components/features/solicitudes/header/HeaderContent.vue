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
  <BNavbar :class="{ mobile }" class="px-md-3">
    <template v-if="!noLeftButton && mobile">
      <BButton variant="flat wh-34 ms-n1 me-1" v-tippy="'Abrir menú de la aplicación'" v-b-toggle.drawer-left>
        <IBiList class="center" />
      </BButton>
    </template>
    <BNavbarBrand to="/home" class="py-0" :class="{ 'fs-6 fw-semibold': mobile }">
      {{ title }}
    </BNavbarBrand>
    <div class="ms-auto d-flex gap-2">
      <Notificaciones />
      <AppsMenu v-if="!mobile" />
      <UserMenu v-if="!mobile" />
    </div>
  </BNavbar>
</template>