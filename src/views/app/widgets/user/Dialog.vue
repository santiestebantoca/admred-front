<script setup>
import useAuthStore from '@/stores/auth'
import { ref, computed } from 'vue'

const authUser = computed(() => useAuthStore().authUser)
const actions = computed(() => {
  return [
    { title: 'Cerrar sesión', path: { name: 'auth-logout' }, icon: 'box-arrow-right' },
    ...authUser.value?.can_impersonate || authUser.value?.is_impersonating
      ? [{ title: 'Personificar', path: { name: 'auth-impersonate' }, icon: 'people' }]
      : []
  ]
})
const impersonatingAlert = computed(() => authUser.value.is_impersonating)
const dialog = ref(null)
</script>


<template>
  <div>
    <bs-btn @click="dialog = !dialog" class="btn-header" flat>
      <img src="@/assets/images/user.png" width="22" height="22" class="me-2">
      <span class="text-truncate pe-2" v-text="authUser.name" />
      <bs-icon name="box-arrow-up-right" class="ms-auto" />
    </bs-btn>
    <bs-dialog v-model="dialog" fullSmDown>
      <bs-dialog-header label="Usuario" />
      <bs-dialog-body>
        <p v-if="impersonatingAlert" class="text-center text-danger fw-bold">
          Personificado
        </p>
        <p class="">
          <span class="h5 d-block fw-semibold" v-text="authUser.name" />
          <span class="text-muted" v-text="authUser.username" />
        </p>
        <p class="mb-4">@ <span v-text="authUser.area_nombre" /></p>
        <div>
          <bs-btn v-for="action in actions" :key="action.title" :to="action.path" :icon="action.icon" class="me-3"
            color="primary" flat isize="1rem" :label="action.title" />
        </div>
      </bs-dialog-body>
    </bs-dialog>
  </div>
</template>

<style scoped>
.btn-header {
  width: 100%;
  display: flex;
  align-items: center;
  color: var(--bs-gray-700);
}
</style>