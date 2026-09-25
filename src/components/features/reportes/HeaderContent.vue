<script lang="ts" setup>
import { inject } from 'vue'

const mobile = inject('app:mobile')
const title = inject('page:title')
</script>

<template>
  <BNavbar :class="{ mobile }" class="px-md-3">
    <template v-if="mobile">
      <BButton variant="flat wh-34 ms-n1 me-1" v-tippy="'Abrir menú de la aplicación'" v-b-toggle.drawer-left>
        <IBiList class="center" />
      </BButton>
    </template>
    <BNavbarBrand to="/home" class="py-0 me-auto" :class="{ 'fs-6 fw-semibold': mobile }">
      {{ title }}
    </BNavbarBrand>
  </BNavbar>
</template>