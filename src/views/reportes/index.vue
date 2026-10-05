<script setup>
import AltLayout from '@/layouts/AltLayout.vue'
import DrawerContent from '@/components/features/reportes/DrawerContent.vue'
import HeaderContent from '@/components/features/reportes/HeaderContent.vue'
import { ref, provide } from 'vue'

const title = ref('Reportes')
provide('reportes:title', title)
</script>

<template>
  <AltLayout class="main-layout">
    <template #header-content>
      <HeaderContent />
    </template>
    <template #drawer-content="{ up }">
      <DrawerContent :up="up" />
    </template>
    <template #page-content>
      <RouterView />
    </template>
  </AltLayout>
</template>