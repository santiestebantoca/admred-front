<script setup>
import AltLayout from '@/layouts/AltLayout.vue'
import DrawerContent from '@/components/features/admin/DrawerContent.vue'
import HeaderContent from '@/components/features/admin/HeaderContent.vue'
import { ref, provide } from 'vue'

const title = ref('Administración')
provide('admin:title', title)
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