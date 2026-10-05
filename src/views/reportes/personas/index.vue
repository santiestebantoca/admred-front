<script setup>
const props = defineProps({
  personaId: Number,
  setPersonaId: Function
})

import { useTramitadoresQuery } from '@/stores/tramitadores'
import { inject } from 'vue'

const { tramitadores, isPending } = useTramitadoresQuery()
const title = inject('reportes:title')

title.value = 'Desempeño personal'
</script>

<template>
  <div class="pt-3">
    <p>
      Desempeño personal del trabajador como supervisor y como tramitador.
    </p>
    <div v-if="isPending" class="my-5 py-5 text-center">
      <BSpinner />
    </div>
    <template v-else-if="!personaId">
      <BListGroup class="custom">
        <BListGroupItem v-for="{ id, name } in tramitadores" :key="id" button @click="setPersonaId(id)">
          <IBiPersonCircle class="text-success" />
          {{ name }}
        </BListGroupItem>
      </BListGroup>
    </template>
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
.custom {
  display: inline-block;
  --bs-list-group-border-color: transparent;
  --bs-list-group-border-radius: 0;

  .list-group-item {
    border-radius: var(--bs-border-radius-lg);
  }
}
</style>