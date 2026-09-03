<script setup>
const props = defineProps({
  horizontal: Boolean,
  user: Object,
  solicitud: Object,
  acciones: Object
})

import { computed } from 'vue'

const opciones = computed(() => {
  const userRol = {
    supervisorArea: (props.solicitud.destino.id === props.user.area) && props.user.supervisor,
    supervisor: props.solicitud.supervisor?.id === props.user.id,
    tramitador: props.solicitud.tramitador?.id === props.user.id,
    remitente: props.solicitud.remitente.id === props.user.id
  }

  const asignar = props.solicitud.estado.id < 3 && userRol.supervisorArea
  const reenviar =
    (props.solicitud.estado.id === 2 && userRol.tramitador) || (props.solicitud.estado.id === 1 && userRol.supervisorArea)
  const responder = props.solicitud.estado.id === 2 && userRol.tramitador
  const aprobar = props.solicitud.estado.id === 3 && userRol.supervisor
  const ranquear = props.solicitud.estado.id === 4 && !props.solicitud.evaluacion && userRol.remitente

  return [
    ...asignar ? [{ title: 'Asignar', to: props.acciones.asignar.go, icon: 'bi-person' }] : [],
    ...reenviar ? [{ title: 'Reenviar', to: props.acciones.reenviar.go, icon: 'bi-forward' }] : [],
    ...responder ? [{ title: 'Responder', to: props.acciones.responder.go, icon: 'bi-reply' }] : [],
    ...aprobar ? [{ title: 'Aprobar', to: props.acciones.aprobar.go, icon: 'bi-patch-check' }] : [],
    ...ranquear ? [{ title: 'Calificar', to: props.acciones.ranquear.go, icon: 'bi-star' }] : [],
    { divider: true },
    { title: 'Registro', to: props.acciones.registro.go, icon: 'bi-clock-history' },
    { title: 'Notas', to: props.acciones.notas.go, icon: 'bi-sticky', badge: props.solicitud.cant_nota },
  ]
})
</script>

<template>
  <div v-if="horizontal" class="horizontal">
    <div v-for="{ divider, to, title, icon, badge } in opciones" :key="title">
      <BButton v-if="!divider" @click="to" variant="link">
        <UIcon :name="icon" />
        {{ title }}
        <BBadge v-if="badge" variant="secondary">
          ({{ badge }})
        </BBadge>
      </BButton>
    </div>
  </div>
  <template v-else>
    <template v-for="{ divider, to, title, icon, badge } in opciones">
      <BDropdownDivider v-if="divider" />
      <BDropdownItemButton v-else @click="to">
        <UIcon :name="icon" />
        {{ title }}
        <BBadge v-if="badge" variant="secondary" :key="title">
          ({{ badge }})
        </BBadge>
      </BDropdownItemButton>
    </template>
  </template>
</template>

<style scoped lang="scss">
.horizontal {
  display: flex;
  gap: 6px;

  .btn-link {
    text-decoration: none;
    font-size: .875em;
    --bs-btn-padding-x: 0.5rem;
    --bs-btn-padding-y: 0.25rem;
    --bs-btn-color: var(--bs-gray-700);
    // --bs-btn-bg: var(--bs-gray-100);
    --bs-btn-hover-bg: var(--bs-gray-200);
    --bs-btn-active-bg: var(--bs-gray-200);
    --bs-btn-active-border-color: var(--bs-gray-300);

  }
}
</style>