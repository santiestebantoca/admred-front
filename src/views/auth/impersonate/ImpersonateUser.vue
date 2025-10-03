<script setup>
import useAuthStore from '@/stores/auth'
import { useTeleportTarget } from '@/use/useTeleportTarget'
import { computed, inject } from 'vue'

const auth = useAuthStore()
const mobile = inject('app:mobile')
const target = useTeleportTarget('#app-footer-content')
const items = computed(() => [
  { label: 'Id', value: auth.authUser.id },
  { label: 'Nombre', value: auth.authUser.name },
  { label: 'Nombre de usuario', value: auth.authUser.username },
  { label: 'Correo', value: auth.authUser.email },
  { label: 'Grupos', value: Object.values(auth.authUser.user_groups).join(', ') },
])
const impersonate = () => auth.impersonate.post()
  .then(() => window.location.reload())
</script>

<template>
  <p class="fw-semibold">
    Usuario actual
    <span v-if="!auth.authUser.can_impersonate" class="text-danger">(no puede personificar)</span>
  </p>
  <ul class="list-group">
    <li v-for="{ label, value } in items" class="list-group-item">
      <label v-text="label" />
      <div v-text="value" />
    </li>
  </ul>
  <template v-if="auth.authUser.is_impersonating">
    <template v-if="mobile">
      <Teleport v-if="target" to="#app-footer-content">
        <div class="bg-light hstack justify-content-center">
          <bs-btn-footer label="Usuario anterior" icon="arrow-return-left" @click="impersonate" />
        </div>
      </Teleport>
    </template>
    <template v-else>
      <div class="mt-4">
        <bs-btn color="primary" label="Usuario anterior" icon="arrow-return-left" @click="impersonate" />
      </div>
    </template>
  </template>
</template>

<style scoped>
label {
  color: var(--bs-gray);
  font-size: .875em;
}
</style>