<script lang="ts" setup>
import { useAuthQuery } from '@/stores/auth'
import { BButton, BModal } from 'bootstrap-vue-next'
import { ref, computed } from 'vue'

const { authUser } = useAuthQuery()
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
  <BButton @click="dialog = !dialog" class="btn-header" variant="flat">
    <img src="@/assets/images/user.png" width="22" height="22" class="me-2">
    <span class="text-truncate pe-2" v-text="authUser.name" />
    <UIcon name="bi-box-arrow-up-right" class="ms-auto" />
  </BButton>
  <BModal v-model="dialog" title="Usuario">
    <p v-if="impersonatingAlert" class="text-center text-danger fw-bold">
      Personificado
    </p>
    <p class="">
      <span class="h5 d-block fw-semibold" v-text="authUser.name" />
      <span class="text-muted" v-text="authUser.username" />
    </p>
    <p class="mb-4">@ <span v-text="authUser.area_nombre" /></p>
    <div>
      <BButton v-for="action in actions" :key="action.title" :to="action.path" variant="flat-primary">
        <UIcon :name="action.icon" />
        {{ action.title }}
      </BButton>
    </div>
  </BModal>
</template>

<style scoped>
.btn-header {
  width: 100%;
  display: flex;
  align-items: center;
  color: var(--bs-gray-700);
}
</style>