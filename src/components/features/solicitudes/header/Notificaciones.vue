<script setup>
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
    <BButton @click="model = true" variant="navbar" v-tippy="'Notificaciones'" :class="{ 'me-3': !mobile }">
      <UIcon name="bi-bell" class="center" />
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
            <span class="estado-badge" data-estado="Solicitado">
              Por asignar ({{ notificaciones.pendientes.recibidas.por_asignar.length }})
            </span>
          </p>
        </BCol>
        <BCol sm="auto" v-for="solicitud in notificaciones.pendientes.recibidas.por_asignar" class="pb-2">
          <BButton :to="{ query: { item: solicitud.id } }" @click="model = false" size="sm" variant="link">
            {{ solicitud.codigo }}
          </BButton>
        </BCol>
      </BRow>
      <BRow v-if="notificaciones.pendientes.recibidas.por_responder.length" align-h="start" class="pb-2">
        <BCol cols="12">
          <p>
            <span class="estado-badge" data-estado="En proceso">
              Por responder ({{ notificaciones.pendientes.recibidas.por_responder.length }})
            </span>
          </p>
        </BCol>
        <BCol sm="auto" v-for="solicitud in notificaciones.pendientes.recibidas.por_responder" class="pb-2">
          <BButton :to="{ query: { item: solicitud.id } }" @click="model = false" size="sm" variant="link">
            {{ solicitud.codigo }}
          </BButton>
        </BCol>
      </BRow>
      <BRow v-if="notificaciones.pendientes.recibidas.por_aprobar.length" align-h="start" class="pb-2">
        <BCol cols="12">
          <p>
            <span class="estado-badge" data-estado="En evaluación">
              Por aprobar ({{ notificaciones.pendientes.recibidas.por_aprobar.length }})
            </span>
          </p>
        </BCol>
        <BCol sm="auto" v-for="solicitud in notificaciones.pendientes.recibidas.por_aprobar" class="pb-2">
          <BButton :to="{ query: { item: solicitud.id } }" @click="model = false" size="sm" variant="link">
            {{ solicitud.codigo }}
          </BButton>
        </BCol>
      </BRow>
    </BModal>
  </template>
</template>

<style scoped lang="scss">
.btn-link {
  text-decoration: none;
  border: 1px solid var(--bs-primary-300);
}
</style>