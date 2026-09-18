<script setup>
const props = defineProps({
  horizontal: Boolean,
  user: Object,
  solicitud: Object,
})

import { computed } from 'vue'

const opciones = computed(() => {
  return [
    ...props.solicitud.permisos.asignar
      ? [{ title: 'Asignar', to: { name: 'solicitudes-solicitud-asignar' }, icon: 'bi-person' }]
      : [],
    ...props.solicitud.permisos.reenviar
      ? [{ title: 'Reenviar', to: { name: 'solicitudes-solicitud-reenviar' }, icon: 'bi-forward' }]
      : [],
    ...props.solicitud.permisos.responder
      ? [{ title: 'Responder', to: { name: 'solicitudes-solicitud-responder' }, icon: 'bi-reply' }]
      : [],
    ...props.solicitud.permisos.aprobar
      ? [{ title: 'Aprobar', to: { name: 'solicitudes-solicitud-aprobar' }, icon: 'bi-patch-check' }]
      : [],
    ...props.solicitud.permisos.evaluar
      ? [{ title: 'Evaluar', to: { name: 'solicitudes-solicitud-evaluar' }, icon: 'bi-star' }]
      : [],
    { divider: true },
    { title: 'Registro', to: { name: 'solicitudes-solicitud-registro' }, icon: 'bi-clock-history' },
    { title: 'Notas', to: { name: 'solicitudes-solicitud-notas' }, icon: 'bi-sticky', badge: props.solicitud.cant_nota },
  ]
})
</script>

<template>
  <div v-if="horizontal" class="horizontal">
    <div v-for="{ divider, to, title, icon, badge } in opciones" :key="title">
      <BButton v-if="!divider" :to="to" variant="flat btn-sm">
        <UIcon :name="icon" />
        {{ title }}
        <BBadge v-if="badge" pill variant="info">
          ({{ badge }})
        </BBadge>
      </BButton>
    </div>
  </div>
  <template v-else>
    <template v-for="{ divider, to, title, icon, badge } in opciones">
      <BDropdownDivider v-if="divider" />
      <BDropdownItem v-else :to="to">
        <UIcon :name="icon" />
        {{ title }}
        <BBadge v-if="badge" variant="secondary">
          ({{ badge }})
        </BBadge>
      </BDropdownItem>
    </template>
  </template>
</template>

<style scoped lang="scss">
.horizontal {
  display: flex;
  gap: 6px;
}
</style>