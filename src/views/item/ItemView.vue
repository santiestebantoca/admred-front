<script setup>
import ItemAssign from './forms/ItemFormAssign.vue'
import ItemForward from './forms/ItemFormForward.vue'
import ItemReply from './forms/ItemFormReply.vue'
import ItemApprove from './forms/ItemFormApprove.vue'
import ItemRate from './forms/ItemFormRate.vue'
import ItemRecord from './ItemRecord.vue'
import ItemNote from './ItemNote.vue'
import ItemActions from './ItemActions.vue'
import ClampText from '@/components/ClampText.vue'
import ItemInlineUserInfo from './ItemInlineUserInfo.vue'
import ItemTimeBlock from './ItemTimeBlock.vue'
import ItemRelatedItems from './ItemRelatedItems.vue'
import ItemDocEntrada from './ItemDocEntrada.vue'
import ItemDocSalida from './ItemDocSalida.vue'
import useItemStore from '@/stores/item'
import { formatDate } from '@/use/useDates'
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, inject } from 'vue'

const mobile = inject('app:mobile')
const xlDown = inject('app:xlDown')
const route = useRoute()
const router = useRouter()
const item = useItemStore()
const data = computed(() => item.data)
const action = computed(() => route.query.action)
const close = () => router.push({ query: { ...route.query, item: undefined } })
const clearAction = () => router.push({ query: { ...route.query, action: undefined } })
const collapse1 = ref(null)
const collapse2 = ref(null)
const drawer = ref(null)
</script>

<template>
  <app-layout :view="mobile ? 'hhh lpr fff' : 'lhh lPr lff'">
    <app-header>
      <nav class="navbar py-0" style="height: 48px">
        <div class="container-fluid px-1">
          <bs-btn-menu v-if="mobile" @click="drawer = true" />
          <transition name="flash" appear mode="out-in">
            <span v-text="data.codigo" class="ms-auto p-2" :key="data.codigo" />
          </transition>
          <div class="me-auto position-relative">
            <div v-if="data.root && !xlDown" class="codigo-label">(Demanda inicial)</div>
          </div>
          <bs-btn-close @click="close" />
        </div>
      </nav>
    </app-header>
    <app-drawer v-model="drawer" class="bg-primary">
      <div class="p-3 mb-3">
        <bs-btn-icon color="primary" @click="close" icon="arrow-left-circle" style="font-size:30px">
          <bs-tooltip placement="bottom" offset="0,10">Volver</bs-tooltip>
        </bs-btn-icon>
      </div>
      <ItemActions @close="close" @action="drawer = false" />
    </app-drawer>
    <app-page-container>
      <app-page :key="data?.id || 0">
        <div class="grid">
          <div class="grid-header">
            <div style="font-size:22px">Solicitud</div>
          </div>
          <!-- Col A -->
          <div class="grid-A">
            <div v-if="data.root && xlDown" class="text-center">(Demanda inicial)</div>
            <div>
              <div class="subtitle">Estado</div>
              <div v-text="data.estado.nombre" />
            </div>
            <div>
              <div class="subtitle">De</div>
              <ItemInlineUserInfo :user="data.remitente" />
              <div v-text="'@ ' + data.origen.nombre" />
            </div>
            <div>
              <div class="subtitle">Tiempos</div>
              <div style="max-width: 280px">
                <ItemTimeBlock />
              </div>
            </div>
            <div v-if="data.estado.id > 1">
              <div class="subtitle">Personas relacionadas</div>
              <template v-if="data.supervisor.id === data.tramitador.id">
                <div class="subtitle">Supervisor / Tramitador </div>
                <ItemInlineUserInfo :user="data.supervisor" />
              </template>
              <template v-else>
                <div class="subtitle">Supervisor</div>
                <ItemInlineUserInfo :user="data.supervisor" />
                <div class="subtitle mt-2">Tramitador</div>
                <ItemInlineUserInfo :user="data.tramitador" />
              </template>
            </div>
            <div v-if="data.padre || data.hijos.length">
              <div class="subtitle">Solicitudes relacionadas</div>
              <div style="max-width: 280px">
                <ItemRelatedItems />
              </div>
            </div>
          </div>
          <!-- Col B -->
          <div class="grid-B">
            <div>
              <div class="subtitle">Área consultada</div>
              <div v-text="data.destino.nombre" />
            </div>
            <div>
              <div class="subtitle">Objetivo o alcance de la demanda</div>
              <ClampText :lines="5">{{ data.objetivo }}</ClampText>
            </div>
            <div v-if="data.cumplir_en">
              <div class="subtitle">Fecha de cumplimiento</div>
              <div v-text="formatDate(data.cumplir_en)" />
            </div>
            <div v-if="data.adjuntos_solicitud.length" class="mt-2 border-1 rounded" style="padding:2px">
              <div type="button" @click="collapse1 = !collapse1" class="hstack" style="height:32px">
                <bs-icon name="paperclip" class="px-1" fs="1.1rem" />
                {{ data.adjuntos_solicitud.length }}
                {{ data.adjuntos_solicitud.length === 1 ? 'adjunto' : 'adjuntos' }}
                <bs-btn-caret line class="ps-2" />
              </div>
              <bs-collapse v-model="collapse1" class="px-1 pb-2">
                <ItemDocEntrada />
              </bs-collapse>
            </div>
            <!-- <div class="border-top" /> -->
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
            <div v-if="data.adjuntos_respuesta.length" class="mt-2 border-1 rounded" style="padding:2px">
              <div type="button" @click="collapse2 = !collapse2" class="hstack" style="height:32px">
                <bs-icon name="paperclip" class="px-1" fs="1.1rem" />
                {{ data.adjuntos_respuesta.length }}
                {{ data.adjuntos_respuesta.length === 1 ? 'adjunto' : 'adjuntos' }}
                <bs-btn-caret line class="ps-2" />
              </div>
              <bs-collapse v-model="collapse2" class="px-1 pb-2">
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
            </div>
          </div>
        </div>
      </app-page>
    </app-page-container>
    <ItemAssign v-if="action === 'assign'" @close="clearAction" />
    <ItemForward v-if="action === 'forward'" @close="clearAction" />
    <ItemReply v-if="action === 'reply'" @close="clearAction" />
    <ItemApprove v-if="action === 'approve'" @close="clearAction" />
    <ItemRate v-if="action === 'rate'" @close="clearAction" />
    <ItemRecord v-if="action === 'record'" @close="clearAction" />
    <ItemNote v-if="action === 'note'" @close="clearAction" />
  </app-layout>
</template>

<style scoped>
.grid {
  --grid-padding-x: 12px;
  --template-columns: 1fr;
  --template-rows: auto auto;
  --template-areas:
    "a"
    "b";
  padding-left: var(--grid-padding-x);
  padding-right: var(--grid-padding-x);
  padding-bottom: 24px;
  display: grid;
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
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(var(--bs-primary-rgb), .2);
}

.grid-B {
  grid-area: b;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow: auto;
  padding-top: 32px;
}

/* xl */
@media(min-width:1200px) {
  .grid {
    height: 100%;
    max-width: 1200px;
    --grid-padding-x: 24px;
    --template-columns: minmax(240px, 7fr) 16fr;
    --template-rows: 60px 1fr;
    --template-areas:
      "h h"
      "a b";
  }

  .grid-header {
    display: block;
  }

  .grid-A {
    padding-bottom: 0;
    border-bottom: unset;
    padding-right: 16px;
    border-right: 1px solid rgba(var(--bs-primary-rgb), .2);
  }

  .grid-B {
    padding-top: unset;
    padding-left: 32px;
    padding-right: 16px;
  }
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