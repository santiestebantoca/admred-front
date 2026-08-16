<script setup>
import { useAuthQuery } from '@/stores/auth'
import { computed } from 'vue'

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
</script>

<template>
  <bs-dropdown v-if="authUser">
    <bs-dropdown-toggle>
      <bs-btn-icon flat size="38px">
        <img src="@/assets/images/user.png" width="22" height="22">
        <bs-tooltip offset="-70,10">
          <div class="fw-bold text-start">Cuenta</div>
          <div class="text-truncate text-start text-light" v-text="authUser.name" />
        </bs-tooltip>
      </bs-btn-icon>
    </bs-dropdown-toggle>
    <bs-dropdown-menu end class="shadow" style="width:340px">
      <p v-if="impersonatingAlert" class="text-center text-danger fw-bold pe-3">
        Personificado
      </p>
      <p class="m-3 mt-2">
        <span class="h5 d-block fw-semibold" v-text="authUser.name" />
        <span class="text-muted" v-text="authUser.username" />
      </p>
      <p class="m-3">@ <span v-text="authUser.area_nombre" /></p>
      <div class="mx-2">
        <bs-btn v-for="action in actions" :key="action.title" :to="action.path" :icon="action.icon" class="me-3"
          color="primary" flat isize="1rem" :label="action.title" />
      </div>
    </bs-dropdown-menu>
  </bs-dropdown>
</template>