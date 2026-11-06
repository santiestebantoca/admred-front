<script lang="ts" setup>
import IndicadorCarga from '@/components/commons/IndicadorCarga.vue'
import { useTramitadoresQuery } from '@/stores/tramitadores'
import { inject, type Ref } from 'vue'

const props = defineProps<{
  personaId?: number
  setPersonaId?: (personaId: number) => void
}>()

const { tramitadores, isPending } = useTramitadoresQuery()
const title = inject<Ref<string>>('reportes:title')

title.value = 'Desempeño personal'
</script>

<template>
  <div class="pt-3">
    <p>
      Desempeño personal del trabajador como supervisor y como tramitador.
    </p>
    <IndicadorCarga v-if="isPending" texto="Cargando personas…" detalle="Un momento por favor." />
    <template v-else-if="!personaId">
      <BListGroup v-if="tramitadores?.length" class="custom">
        <BListGroupItem v-for="{ id, name } in tramitadores" :key="id" button @click="setPersonaId(id)">
          <ILucideUserSearch class="text-success" />
          {{ name }}
        </BListGroupItem>
      </BListGroup>
      <p v-else class="text-center text-muted">No hay personas disponibles para consultar.</p>
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