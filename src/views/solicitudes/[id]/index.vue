<script setup>
const props = defineProps({
  solicitudId: Number,
  linkSolicitud: Function,
  back: Function,
  rutaBase: String
})

import AccionesMenu from '@/components/features/solicitudes/[id]/AccionesMenu.vue'
import TiemposSubCard from '@/components/features/solicitudes/[id]/TiemposSubCard.vue'
import ParticipantesSubCard from '@/components/features/solicitudes/[id]/ParticipantesSubCard.vue'
import EsquemaSubCard from '@/components/features/solicitudes/[id]/EsquemaSubCard.vue'
import AdjuntosSubCard from '@/components/features/solicitudes/[id]/AdjuntosSubCard.vue'
import EvaluacionWidget from '@/components/features/solicitudes/[id]/EvaluacionWidget.vue'
import { useSolicitudQuery } from '@/stores/solicitudes'
import { useAuthQuery } from '@/stores/auth'
import { formatDate } from '@/composables/useDates'
import { ref, computed, inject, onMounted, watchEffect } from 'vue'

const xlDown = inject('app:xlDown')
const model = ref(false)
const shown = ref(false)
const solicitud = ref(undefined)
const { solicitud: _solicitud, isPending, isLoading, solicitudId } = useSolicitudQuery()
const { authUser } = useAuthQuery()
const rootStyle = computed(() => ({
  '--bs-modal-header-border-width': 0,
  '--bs-modal-bg': 'var(--bs-surface-1)',
  '--bs-modal-padding': '0',
}))

onMounted(() => watchEffect(() => !isPending.value && (model.value = true))) // espera al inicio
watchEffect(() => solicitudId.value = props.solicitudId)
watchEffect(() => _solicitud.value && (solicitud.value = _solicitud.value)) // evita parpadeo
</script>

<template>
  <BModal v-model="model" fullscreen no-footer no-backdrop @hidden="back" :style="rootStyle"
    body-class="position-static" lazy @shown="shown = true">
    <template #header>
      <BButton @click="model = false" class="rounded-5">
        <IBiArrowLeft class="center" />
      </BButton>
      <span class="mx-auto">
        {{ solicitud?.codigo || '#' }}
        <span v-if="solicitud?.root" class="mark rounded-3 px-2 fw-semibold">Inicial</span>
      </span>
      <BDropdown v-if="xlDown" no-caret>
        <template #button-content>
          <IBiList class="center" />
        </template>
        <AccionesMenu :user="authUser" :solicitud="solicitud" :rutaBase="rutaBase" />
      </BDropdown>
    </template>
    <BOverlay :show="isLoading" no-wrap :variant="white" :opacity=".3" :blur="5" />
    <!-- Body -->
    <div :key="solicitud.id" class="container grid solicitud">
      <div class="grid-header hstack gap-3">
        <h5>Solicitud</h5>
        <EvaluacionWidget v-if="solicitud.evaluacion" :solicitud="solicitud" class="my-auto" />
        <AccionesMenu horizontal class="ms-auto" :user="authUser" :solicitud="solicitud" :rutaBase="rutaBase" />
      </div>
      <!-- Col A -->
      <div class="grid-A">
        <div>
          <div class="label">Estado</div>
          <div class="data">
            {{ solicitud.estado.nombre }}
          </div>
        </div>
        <div>
          <div class="label">De</div>
          <div class="data">
            {{ solicitud.origen.nombre }}
          </div>
        </div>
        <div class="max-w-300">
          <div class="label">Tiempos</div>
          <TiemposSubCard :solicitud="solicitud" />
        </div>
        <div>
          <div class="label">Participantes</div>
          <ParticipantesSubCard :solicitud="solicitud" />
        </div>
        <div>
          <div class="label">Esquema</div>
          <EsquemaSubCard :solicitud="solicitud" :linkSolicitud="linkSolicitud" />
        </div>
      </div>
      <!-- Col B -->
      <div class="grid-B border rounded-3">
        <div>
          <div class="label">Área consultada</div>
          <div class="data">
            {{ solicitud.destino.nombre }}
          </div>
        </div>
        <div>
          <div class="label">Objetivo o alcance de la demanda</div>
          <ClampText :lines="5" class="data">
            {{ solicitud.objetivo }}
          </ClampText>
        </div>
        <div v-if="solicitud.cumplir_en">
          <div class="label">Fecha de cumplimiento</div>
          <div class="data">
            {{ formatDate(solicitud.cumplir_en) }}
          </div>
        </div>
        <div v-if="solicitud.adjuntos_solicitud.length">
          <AdjuntosSubCard :adjuntos="solicitud.adjuntos_solicitud" />
        </div>
        <div class="dashed" />
        <div>
          <div v-if="solicitud.respuesta_en" class="title-respuesta">
            <div>Respuesta del área consultada</div>
            <div class="title-respuesta-estado">
              <span v-if="solicitud.estado.id === 2" class="desaprobada">Desaprobada por el supervisor</span>
              <span v-if="solicitud.estado.id === 3" class="pendiente">Pendiente de aprobación</span>
              <span v-if="solicitud.estado.id === 4">Aprobada por el supervisor</span>
            </div>
          </div>
          <div v-else class="title-sin-respuesta">
            <span>Sin respuesta del área consultada.</span>
            <IBiExclamationSquareFill class="float-end" />
          </div>
        </div>
        <div v-if="solicitud.observaciones">
          <div class="label">Observaciones</div>
          <div class="data">
            {{ solicitud.observaciones }}
          </div>
        </div>
        <div v-if="solicitud.adjuntos_respuesta.length">
          <AdjuntosSubCard :adjuntos="solicitud.adjuntos_respuesta" />
        </div>
      </div>
    </div>
  </BModal>
  <RouterView v-if="shown" />
</template>

<style scoped lang="scss">
.grid {
  --template-columns: 1fr;
  --template-rows: auto auto;
  --template-areas:
    "a"
    "b";
  padding: 8px;
  display: grid;
  gap: 8px;
  grid-template-columns: var(--template-columns);
  grid-template-rows: var(--template-rows);
  grid-template-areas: var(--template-areas);
}

.grid-header {
  grid-area: h;
  display: none;
}

.grid-A {
  grid-area: a;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow: auto;
  padding: 8px 12px;
  border: 1px solid var(--bs-border-color);
  border-radius: var(--bs-border-radius-lg);
}

.grid-B {
  grid-area: b;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow: auto;
  padding: 8px 12px;
  background-color: white;
}

/* xl */
@media(min-width:1200px) {
  .grid {
    height: 100%;
    --template-columns: minmax(240px, 7fr) 16fr;
    --template-rows: auto 1fr;
    --template-areas:
      "h h"
      "a b";
  }

  .grid-header {
    display: flex;
  }

  .grid-A {}

  .grid-B {}
}

.dashed {
  border-top: var(--bs-border-width) dashed var(--bs-tertiary-color);
}

.title-respuesta {
  color: var(--bs-success);

  .title-respuesta-estado {
    font-size: small;
    font-weight: 600;
    line-height: 1.8;

    &:before {
      content: "[ ";
      color: var(--bs-gray-500);
    }

    &:after {
      content: " ]";
      color: var(--bs-gray-500);
    }

    .desaprobada {
      color: var(--bs-danger);
    }

    .pendiente {
      color: var(--bs-orange);
    }
  }
}

.title-sin-respuesta {
  color: var(--bs-danger);
}
</style>
