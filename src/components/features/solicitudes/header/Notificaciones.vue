<script setup>
import { useNotificacionesQuery } from '@/stores/notificaciones'
import { ref, computed, inject } from 'vue'

const mobile = inject('app:mobile')
const setSolicitudId = inject('solicitudes:setSolicitudId')
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
    <BButton @click="model = true" variant="flat wh-34" v-tippy="'Notificaciones'" :class="{ 'me-3': !mobile }">
      <UIcon name="bi-bell" class="center" />
      <BBadge variant="danger" class="position-absolute top-0 translate-middle-x" pill
        :class="[mobile ? 'start-0' : 'start-100']">
        {{ porAtender }}
      </BBadge>
    </BButton>
    <BModal v-model="model" title="Notificaciones" no-footer no-stack>
      <p>
        Solicitudes con acciones pendientes.
      </p>
      <BRow v-if="notificaciones.pendientes.recibidas.por_asignar.length" align-h="start" class="pb-2" gutter-x="2">
        <BCol cols="12">
          <p>
            <span class="estado-badge" data-estado="Solicitado">
              Por asignar ({{ notificaciones.pendientes.recibidas.por_asignar.length }})
            </span>
          </p>
        </BCol>
        <BCol sm="auto" v-for="solicitud in notificaciones.pendientes.recibidas.por_asignar" class="pb-2">
          <BButton @click="setSolicitudId(solicitud.id)" variant="link">
            {{ solicitud.codigo }}
          </BButton>
        </BCol>
      </BRow>
      <BRow v-if="notificaciones.pendientes.recibidas.por_responder.length" align-h="start" class="pb-2" gutter-x="2">
        <BCol cols="12">
          <p>
            <span class="estado-badge" data-estado="En proceso">
              Por responder ({{ notificaciones.pendientes.recibidas.por_responder.length }})
            </span>
          </p>
        </BCol>
        <BCol sm="auto" v-for="solicitud in notificaciones.pendientes.recibidas.por_responder" class="pb-2">
          <BButton @click="setSolicitudId(solicitud.id)" variant="link">
            {{ solicitud.codigo }}
          </BButton>
        </BCol>
      </BRow>
      <BRow v-if="notificaciones.pendientes.recibidas.por_aprobar.length" align-h="start" class="pb-2" gutter-x="2">
        <BCol cols="12">
          <p>
            <span class="estado-badge" data-estado="En evaluación">
              Por aprobar ({{ notificaciones.pendientes.recibidas.por_aprobar.length }})
            </span>
          </p>
        </BCol>
        <BCol sm="auto" v-for="solicitud in notificaciones.pendientes.recibidas.por_aprobar" class="pb-2">
          <BButton @click="setSolicitudId(solicitud.id)" variant="link">
            {{ solicitud.codigo }}
          </BButton>
        </BCol>
      </BRow>
    </BModal>
  </template>
</template>

<style scoped lang="scss">
.btn-link {
  --bs-btn-padding-y: 0.25rem !important;
  --bs-btn-padding-x: 1rem !important;
  border: 1px solid var(--bs-border-color);

  &:hover {
    --bs-border-color: var(--bs-gray-500);
  }
}
</style>