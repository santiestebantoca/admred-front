<script setup>
import useAuthStore from '@/stores/auth'
import { computed } from 'vue'

const authUser = computed(() => useAuthStore().authUser)
const apps = computed(() => {
  return [
    { title: 'Solicitudes', path: '/folder', icon: 'inboxes' },
    { title: 'Reportes', path: '/report', icon: 'graph-up' },
    ...authUser.value?.admin
      ? [{ title: 'Administración', path: '/admin', icon: 'gear' }]
      : []
  ]
})
</script>

<template>
  <bs-dropdown>
    <bs-dropdown-toggle>
      <bs-btn-icon flat size="38px">
        <img src="@/assets/images/apps.svg" class="opacity-75" />
        <bs-tooltip offset="0,10" placement="bottom">Aplicaciones</bs-tooltip>
      </bs-btn-icon>
    </bs-dropdown-toggle>
    <bs-dropdown-menu end class="shadow" style="width: 210px">
      <bs-dropdown-item v-for="(app, i) in apps" :key="i" :to="app.path">
        <bs-icon :name="app.icon" class="me-3" />
        <span v-text="app.title" />
      </bs-dropdown-item>
    </bs-dropdown-menu>
  </bs-dropdown>
</template>

<style scoped>
:deep(.router-link-active) {
  display: none;
}
</style>
