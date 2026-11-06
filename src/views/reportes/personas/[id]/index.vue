<script lang="ts" setup>
import ComoSupervisor from '@/components/features/reportes/personas/ComoSupervisor.vue'
import ComoTramitador from '@/components/features/reportes/personas/ComoTramitador.vue'
import IndicadorCarga from '@/components/commons/IndicadorCarga.vue'
import { useTramitadoresQuery } from '@/stores/tramitadores'
import { usePersonasQuery } from '@/stores/reportes'
import type { RouteLocationRaw } from 'vue-router'
import { computed } from 'vue'

const props = defineProps<{
  personaId: number
  back?: () => unknown
  linkSolicitud?: (solicitudId: number) => RouteLocationRaw
}>()

const { tramitadores, isPending: tramitadoresPending } = useTramitadoresQuery()
const persona = computed(() => tramitadores.value?.find(d => d.id === props.personaId))
const { comoTramitador, comoSupervisor, isPending, isLoading, periodo, enabled, total } = usePersonasQuery(props.personaId)
</script>

<template>
  <div class="position-relative vstack align-items-center p-3 mb-3 border rounded-3 surface-1">
    <BButton @click="back()" class="position-absolute start-0 top-0 m-2 p-3 h-50" variant="flat">
      <IBiChevronCompactLeft class="center fs-4" />
    </BButton>
    <IndicadorCarga v-if="tramitadoresPending" texto="Cargando persona…" />
    <div v-else-if="!persona" class="py-5 text-center text-muted">
      No se encontró la persona solicitada.
    </div>
    <template v-else>
      <ILucideUserSearch class="fs-3 text-success" />
      <h5 class="fw-semibold text-truncate lh-lg">
        {{ persona?.name }}
      </h5>
      <label class="form-label">Período mes/año</label>
      <MonthPicker v-model="periodo" />
    </template>
  </div>
  <div v-if="enabled" class="mb-4 p-3 border rounded-3">
    <IndicadorCarga v-if="isPending" texto="Generando reporte…" detalle="Calculando los datos del período." />
    <template v-else-if="total">
      <IndicadorCarga v-if="isLoading" inline texto="Actualizando…" class="mb-2" />
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