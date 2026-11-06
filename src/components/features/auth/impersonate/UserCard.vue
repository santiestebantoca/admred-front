<script lang="ts" setup>
import { useAuthQuery, useImpersonate } from '@/stores/auth'
import BotonEnvio from '@/components/commons/BotonEnvio.vue'
import { useTeleportTarget } from '@/composables/useTeleportTarget'
import { computed, inject } from 'vue'

const { authUser } = useAuthQuery()
const { mutateAsync: impersonate, asyncStatus: status } = useImpersonate()
const mobile = inject('app:mobile')
const target = useTeleportTarget('#app-footer-content')
const loading = computed(() => status.value === 'loading')
const items = computed(() => [
  { label: 'Id', value: authUser.value.id },
  { label: 'Nombre', value: authUser.value.name },
  { label: 'Nombre de usuario', value: authUser.value.username },
])
</script>

<template>
  <p class="fw-semibold">
    Usuario actual
    <span v-if="!authUser.can_impersonate" class="text-danger">(no puede personificar)</span>
  </p>
  <ul class="list-group">
    <li v-for="{ label, value } in items" class="list-group-item">
      <label v-text="label" />
      <div v-text="value" />
    </li>
  </ul>
  <template v-if="authUser.is_impersonating">
    <!-- <template v-if="mobile">
      <Teleport v-if="target" to="#app-footer-content">
        <div class="bg-light hstack justify-content-center">
          <BButton variant="flat" @click="impersonate">
            Usuario anterior
            <ILucideCornerDownLeft />
          </BButton>
        </div>
      </Teleport>
    </template>
<template v-else> -->
    <div class="mt-4">
      <BotonEnvio @click="impersonate(0)" :loading="loading" texto-cargando="Cambiando usuario…"
        variant="success">
        <ILucideCornerDownLeft />
        <span class="ms-2">Usuario anterior</span>
      </BotonEnvio>
    </div>
    <!-- </template> -->
  </template>
</template>

<style scoped>
label {
  color: var(--bs-gray);
  font-size: .875em;
}
</style>