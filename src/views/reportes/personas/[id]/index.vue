<script setup>
const props = defineProps({
  personaId: Number,
  back: Function,
  linkSolicitud: Function
})

import ComoSupervisor from '@/components/features/reportes/personas/ComoSupervisor.vue'
import ComoTramitador from '@/components/features/reportes/personas/ComoTramitador.vue'
import { useTramitadoresQuery } from '@/stores/tramitadores'
import { usePersonasQuery } from '@/stores/reportes'
import { computed, ref } from 'vue';

const { tramitadores } = useTramitadoresQuery()
const persona = computed(() => tramitadores.value?.find(d => d.id === props.personaId))
const { comoTramitador, comoSupervisor, isPending, periodo, enabled, total } = usePersonasQuery(props.personaId)
</script>

<template>
  <div class="position-relative vstack align-items-center p-3 mb-3 border rounded-3 surface-1">
    <BButton @click="back" class="position-absolute start-0 top-0 m-2 p-3 h-50" variant="flat">
      <IBiChevronCompactLeft class="center fs-4" />
    </BButton>
    <div v-if="!persona" class="py-5 text-center">
      <BSpinner />
    </div>
    <template v-else>
      <IBiPersonCircle class="fs-3 text-success" />
      <h5 class="fw-semibold text-truncate lh-lg">
        {{ persona?.name }}
      </h5>
      <label class="form-label">Período mes/año</label>
      <MonthPicker v-model="periodo" />
    </template>
  </div>
  <div v-if="enabled" class="mb-4 p-3 border rounded-3">
    <div v-if="isPending" class="py-5 text-center">
      <BSpinner />
    </div>
    <template v-else-if="total">
      <BTabs>
        <BTab title="Como supervisor">
          <ComoSupervisor :data="comoSupervisor" :linkSolicitud="linkSolicitud" />
        </BTab>
        <BTab title="Como tramitador">
          <ComoTramitador :data="comoTramitador" :linkSolicitud="linkSolicitud" />
        </BTab>
      </BTabs>
    </template>
    <p v-else class="text-center mt-3">
      El reporte solicitado no devolvió datos.
    </p>
  </div>
  <RouterView />
</template>