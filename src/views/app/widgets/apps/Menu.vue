<script setup>
import { useAuthQuery } from '@/stores/auth'
import { computed } from 'vue'

const { authUser } = useAuthQuery()
const apps = computed(() => {
  return [
    { title: 'Solicitudes', path: '/solicitudes', icon: 'inboxes' },
    { title: 'Reportes', path: '/report', icon: 'graph-up' },
    ...authUser.value?.admin
      ? [{ title: 'Administración', path: '/admin', icon: 'gear' }]
      : []
  ]
})
</script>

<template>
  <bs-dropdown-item v-for="(app, i) in apps" :key="i" :to="app.path">
    <bs-icon :name="app.icon" class="me-3" />
    <span v-text="app.title" />
  </bs-dropdown-item>
</template>

<style scoped>
:deep(.router-link-active) {
  display: none;
}
</style>