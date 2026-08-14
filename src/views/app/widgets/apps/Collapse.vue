<script setup>
import useAuthStore from '@/stores/auth'
import { ref, computed } from 'vue'

const authUser = computed(() => useAuthStore().authUser)
const apps = computed(() => {
  return [
    { title: 'Solicitudes', path: '/solicitudes', icon: 'inboxes' },
    { title: 'Reportes', path: '/report', icon: 'graph-up' },
    ...authUser.value?.admin
      ? [{ title: 'Administración', path: '/admin', icon: 'gear' }]
      : []
  ]
})
const show = ref(null)
</script>

<template>
  <div>
    <bs-btn @click.stop="show = !show" class="w-100 text-start" flat style="color: var(--bs-gray-700);">
      <i class="bi-grid-fill" style="margin:0 3px" />
      <span class="small ms-2">APLICACIONES</span>
      <bs-btn-caret class="float-end" v-model="show" />
    </bs-btn>
    <bs-collapse v-model="show">
      <bs-btn flat v-for="(app, i) in apps" :key="i" :to="app.path" class="btn-li">
        <i :class="`bi-${app.icon}`" style="margin:0 10px 0 16px" />
        <span v-text="app.title" />
      </bs-btn>
    </bs-collapse>
  </div>
</template>

<style scoped>
.btn-li {
  width: 100%;
  text-align: start;
  color: var(--bs-gray-700);
}

.router-link-active {
  display: none;
}
</style>