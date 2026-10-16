<script lang="ts" setup>
const props = defineProps({
  noLeftButton: Boolean,
  title: { default: "Solicitudes" }
})

import AcercaDe from '../../AcercaDe.vue'
import AppsMenu from './AppsMenu.vue'
import Notificaciones from './Notificaciones.vue'
import UserMenu from './UserMenu.vue'
import { inject, ref } from 'vue'

const mobile = inject('app:mobile')
const model = ref(false)
</script>

<template>
  <BNavbar :class="{ mobile }" class="px-md-3">
    <template v-if="!noLeftButton && mobile">
      <BButton variant="flat wh-34 ms-n1 me-1" v-tippy="'Abrir menú de la aplicación'" v-b-toggle.drawer-left>
        <ILucideMenu class="center" />
      </BButton>
    </template>
    <BNavbarBrand to="/home" class="py-0" :class="{ 'fs-6 fw-semibold': mobile }">
      {{ title }}
    </BNavbarBrand>
    <BButton variant="link wh-36" @click="model = true" v-tippy="'Acerca de esta aplicación'">
      <ILucideCircleQuestionMark class="center" />
    </BButton>
    <div class="ms-auto d-flex gap-3">
      <Notificaciones />
      <UserMenu v-if="!mobile" />
      <AppsMenu v-if="!mobile" />
    </div>
    <AcercaDe v-model="model" />
  </BNavbar>
</template>