<script setup>
const props = defineProps({
  active: Number,
  back: Function,
  go: Function,
  acciones: Object
})

import AccionesMenu from '@/components/features/solicitudes/[id]/AccionesMenu.vue'
import TiemposSubCard from '@/components/features/solicitudes/[id]/TiemposSubCard.vue'
import ParticipantesSubCard from '@/components/features/solicitudes/[id]/ParticipantesSubCard.vue'
import GenialogiaSubCard from '@/components/features/solicitudes/[id]/GenialogiaSubCard.vue'
// import ItemAssign from './forms/ItemFormAssign.vue'
// import ItemForward from './forms/ItemFormForward.vue'
// import ItemReply from './forms/ItemFormReply.vue'
// import ItemApprove from './forms/ItemFormApprove.vue'
// import ItemRate from './forms/ItemFormRate.vue'
// import ItemRecord from './ItemRecord.vue'
// import ItemNote from './ItemNote.vue'
// import ItemInlineUserInfo from './ItemInlineUserInfo.vue'
// import ItemDocEntrada from './ItemDocEntrada.vue'
// import ItemDocSalida from './ItemDocSalida.vue'
// import useItemStore from '@/stores/item'
import { useSolicitudQuery } from '@/stores/solicitudes'
import { useAuthQuery } from '@/stores/auth'
import { formatDate } from '@/composables/useDates'
import { ref, computed, inject, onMounted, watchEffect } from 'vue'

const mobile = inject('app:mobile')
const model = ref(false)
const solicitud = ref(undefined)
const { solicitud: _solicitud, isPending, isLoading, solicitudId } = useSolicitudQuery()
const { authUser } = useAuthQuery()
const rootStyle = computed(() => ({
  '--bs-modal-header-border-width': 0,
  '--bs-modal-bg': 'var(--bs-surface-1)',
  '--bs-modal-padding': '0',
}))

onMounted(() => watchEffect(() => !isPending.value && (model.value = true))) // espera al inicio
watchEffect(() => solicitudId.value = props.active)
watchEffect(() => _solicitud.value && (solicitud.value = _solicitud.value)) // evita parpadeo
</script>

<template>
  <BModal v-model="model" fullscreen no-footer no-backdrop @hidden="back" :style="rootStyle"
    body-class="position-static" lazy>
    <template #header>
      <BButton variant="header" @click="model = false">
        <UIcon name="bi-arrow-left" class="center" />
      </BButton>
      <span class="mx-auto">
        {{ solicitud?.codigo || '#' }}
        <span v-if="solicitud?.root" class="mark rounded-3 px-2 fw-semibold">Inicial</span>
      </span>
      <div class="m-n2">
        <BDropdown v-if="mobile" no-caret variant="header m-0">
          <template #button-content>
            <UIcon name="bi-list" class="center" />
          </template>
          <AccionesMenu :user="authUser" :solicitud="solicitud" :acciones="props.acciones" />
        </BDropdown>
      </div>
    </template>
    <BOverlay :show="isLoading" no-wrap :variant="white" :opacity=".3" :blur="5" />
    <!-- Body -->
    <div :key="solicitud.id" class="container grid">
      <div class="grid-header hstack">
        <h5>Solicitud</h5>
        <template>
          <AccionesMenu horizontal class="ms-auto" :user="authUser" :solicitud="solicitud" :acciones="props.acciones" />
        </template>
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
        <div>
          <div class="label">Tiempos</div>
          <TiemposSubCard :solicitud="solicitud" />
        </div>
        <div>
          <div class="label">Participantes</div>
          <ParticipantesSubCard :solicitud="solicitud" />
        </div>
        <div>
          <div class="label">Genialogía</div>
          <GenialogiaSubCard :solicitud="solicitud" :go="go" />
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
          <ClampText :lines="5">
            {{ solicitud.objetivo }}
          </ClampText>
        </div>
        <!--        <div v-if="data.cumplir_en">
              <div class="subtitle">Fecha de cumplimiento</div>
              <div v-text="formatDate(data.cumplir_en)" />
            </div>
            <div v-if="data.adjuntos_solicitud.length">
              <bs-btn @click="collapse1 = !collapse1" class="ps-0">
                <div class="hstack">
                  <bs-icon :name="!collapse1 ? 'chevron-right' : 'chevron-down'" class="me-1 text-secondary" /> Adjuntos
                  ({{ data.adjuntos_solicitud.length }})
                </div>
              </bs-btn>
              <bs-collapse v-model="collapse1" class="mx-2 border-start px-1 pb-2">
                <ItemDocEntrada />
              </bs-collapse>
            </div>
            <div class="dashed" />
            <div class="text-danger">
              <span v-if="data.respuesta_en">Respuesta del área consultada</span>
              <div v-else class="hstack">
                <span>Sin respuesta del área consultada.</span>
                <i class="bi-exclamation-square ms-auto" />
              </div>
            </div>
            <div v-if="data.observaciones">
              <div class="subtitle">Observaciones</div>
              <div v-text="data.observaciones" />
            </div>
            <div v-if="data.adjuntos_respuesta.length">
              <bs-btn @click="collapse2 = !collapse2" class="ps-0">
                <div class="hstack">
                  <bs-icon :name="!collapse2 ? 'chevron-right' : 'chevron-down'" class="me-1 text-secondary" /> Adjuntos
                  ({{ data.adjuntos_respuesta.length }})
                </div>
              </bs-btn>
              <bs-collapse v-model="collapse2" class="mx-2 border-start px-1 pb-2">
                <ItemDocSalida />
              </bs-collapse>
            </div>
            <div v-if="data.evaluacion" class="mt-auto">
              <div class="border-top my-2" />
              <div class="hstack gap-3">
                <div class="text-body-tertiary hstack gap-2 mt-1-">
                  <i v-for="i in 5" :key="i" class="bi-star-fill" :class="{ 'text-warning': data.evaluacion >= i }" />
                </div>
                <span style="color:var(--bs-gray-600)"> (Consultante)</span>
              </div>
            </div> -->
      </div>
    </div>
    <!-- </app-page>
    </app-page-container> -->
    <!-- <ItemAssign v-if="action === 'assign'" @close="clearAction" />
    <ItemForward v-if="action === 'forward'" @close="clearAction" />
    <ItemReply v-if="action === 'reply'" @close="clearAction" />
    <ItemApprove v-if="action === 'approve'" @close="clearAction" />
    <ItemRate v-if="action === 'rate'" @close="clearAction" />
    <ItemRecord v-if="action === 'record'" @close="clearAction" />
    <ItemNote v-if="action === 'note'" @close="clearAction" /> -->
    <!-- </app-layout> -->
  </BModal>
</template>

<style scoped lang="scss">
.label,
:deep(.label) {
  font-size: .875em;
  font-weight: 600;
  // color: var(--bs-brand);
  // color: var(--bs-brand);
  // margin-bottom: 4px;
}

.label2,
:deep(.label2) {
  // color: var(--bs-brand);
  color: var(--bs-secondary);
  // opacity: 50%;
  font-size: .875em;
  font-weight: 600;
  // margin-bottom: 4px;
}

.data,
:deep(.data) {
  // color: var(--bs-brand);
  color: var(--bs-gray-800);
  // opacity: 50%;
  // font-size: .875em;
  // font-weight: 600;
  margin-bottom: 4px;
}

.btn-header,
:deep(.btn-header) {
  --bs-btn-color: var(--bs-gray-700);
  // --bs-btn-bg: var(--bs-gray-100);
  --bs-btn-hover-bg: var(--bs-gray-200);
  --bs-btn-active-bg: var(--bs-gray-200);
  --bs-btn-active-border-color: var(--bs-gray-300);
  width: 32px;
  height: 32px;
  margin: -0.5rem;
  border-radius: var(--bs-border-radius-xl);
}

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

.border-1 {
  border: solid 1px var(--bs-gray-500);
}

.subtitle {
  line-height: 1.375rem;
  padding-bottom: 4px;
  color: var(--bs-gray-600);
}

.codigo-label {
  position: absolute;
  top: 50%;
  left: 0;
  white-space: nowrap;
  transform: translateY(-50%);
  color: var(--bs-danger);
}
</style>
