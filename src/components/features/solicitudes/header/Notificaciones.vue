<script setup>
import BButton from '@/components/commons/bootstrap-vue-next/BButton.vue'
import { useNotificacionesQuery } from '@/stores/notificaciones'
import { ref, computed, inject } from 'vue'

const mobile = inject('app:mobile')
const { notificaciones } = useNotificacionesQuery()
const porAtender = computed(() => notificaciones.value
  ? notificaciones.value.pendientes.recibidas.por_asignar.length
  + notificaciones.value.pendientes.recibidas.por_responder.length
  + notificaciones.value.pendientes.recibidas.por_aprobar.length
  : false)
const model = ref(false)
</script>

<template>
  <template v-if="porAtender">
    <BButton @click="model = true" variant="navbar" v-tippy="'Notificaciones'" class="position-relative">
      <UIcon name="bi-bell" />
      <BBadge variant="danger" class="position-absolute top-0 translate-middle-x"
        :class="[mobile ? 'start-0' : 'start-100']">
        {{ porAtender }}
      </BBadge>
    </BButton>
    <BModal v-model="model" title="Notificaciones" no-footer>
      <p>
        Solicitudes con acciones pendientes.
      </p>
      <BRow v-if="notificaciones.pendientes.recibidas.por_asignar.length" align-h="start" class="pb-2">
        <BCol cols="12">
          <p>
            <span class="mark warning rounded-3">
              Por asignar ({{ notificaciones.pendientes.recibidas.por_asignar.length }})
            </span>
          </p>
        </BCol>
        <BCol sm="auto" v-for="solicitud in notificaciones.pendientes.recibidas.por_asignar" class="pb-2">
          <BButton :to="{ query: { item: solicitud.id } }" @click="model = false" size="sm"
            variant="flat-outline-success">
            {{ solicitud.codigo }}
          </BButton>
        </BCol>
      </BRow>
      <BRow v-if="notificaciones.pendientes.recibidas.por_responder.length" align-h="start" class="pb-2">
        <BCol cols="12">
          <p>
            <span class="mark danger rounded-3">
              Por responder ({{ notificaciones.pendientes.recibidas.por_responder.length }})
            </span>
          </p>
        </BCol>
        <BCol sm="auto" v-for="solicitud in notificaciones.pendientes.recibidas.por_responder" class="pb-2">
          <BButton :to="{ query: { item: solicitud.id } }" @click="model = false" size="sm"
            variant="flat-outline-success">
            {{ solicitud.codigo }}
          </BButton>
        </BCol>
      </BRow>
      <BRow v-if="notificaciones.pendientes.recibidas.por_aprobar.length" align-h="start" class="pb-2">
        <BCol cols="12">
          <p>
            <span class="mark info rounded-3">
              Por aprobar ({{ notificaciones.pendientes.recibidas.por_aprobar.length }})
            </span>
          </p>
        </BCol>
        <BCol sm="auto" v-for="solicitud in notificaciones.pendientes.recibidas.por_aprobar" class="pb-2">
          <BButton :to="{ query: { item: solicitud.id } }" @click="model = false" size="sm"
            variant="flat-outline-success">
            {{ solicitud.codigo }}
          </BButton>
        </BCol>
      </BRow>
    </BModal>
  </template>
</template>

<style scoped lang="scss">
.mark {
  --bs-highlight-bg: var(--bs-yellow-300);

  &.warning {
    --bs-highlight-bg: var(--bs-warning);
  }

  &.info {
    --bs-highlight-bg: var(--bs-info);
  }
}
</style>