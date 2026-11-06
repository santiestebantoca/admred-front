<script lang="ts" setup>
import {
  useImpersonateQuery,
  useImpersonate
} from '@/stores/auth'
import BotonEnvio from '@/components/commons/BotonEnvio.vue'
import IndicadorCarga from '@/components/commons/IndicadorCarga.vue'
import { BAccordion } from 'bootstrap-vue-next'
import { inject, ref } from 'vue'

const { users, isLoading } = useImpersonateQuery()
const { mutateAsync: impersonate, asyncStatus: status } = useImpersonate()
const mobile = inject('app:mobile')
const objetivo = ref(null)

const personificar = (id) => {
  if (status.value === 'loading') return
  objetivo.value = id
  impersonate(id)
}
</script>
<template>
  <IndicadorCarga v-if="isLoading" inline texto="Buscando usuarios…" class="mb-3" />
  <BAccordion v-else-if="users?.length" class="root">
    <BAccordionItem v-for="{ id, username, name, actual } in users" :title="name">
      <p class="mb-4">
        <span class="d-block" v-if="actual">(Actual)</span>
        <span v-if="username" class="text-muted -small" v-text="username" />
      </p>
      <BotonEnvio @click="personificar(id)" :loading="status === 'loading' && objetivo === id" loading-fill
        :disabled="actual || (status === 'loading' && objetivo !== id)" texto-cargando="Personificando…"
        variant="success">
        <ILucideCornerDownRight />
        <span v-if="!mobile" class="ms-2">Personificar</span>
      </BotonEnvio>
    </BAccordionItem>
  </BAccordion>
  <p v-else class="text-muted mb-0">No se encontraron usuarios.</p>
</template>

<style scoped>
.root {
  --bs-accordion-active-bg: transparent;
  --bs-accordion-btn-focus-box-shadow: none;

  :deep(.accordion-body) {
    padding-top: 12px;
  }

  :deep(.accordion-button:not(.collapsed)) {
    box-shadow: none;
  }
}
</style>