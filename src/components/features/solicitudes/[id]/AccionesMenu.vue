<script setup>
const props = defineProps({
  horizontal: Boolean,
  user: Object,
  solicitud: Object,
  rutaBase: String
})

import { computed } from 'vue'

const opciones = computed(() => {
  return [
    ...props.solicitud.permisos.asignar
      ? [{
        title: 'Asignar',
        to: { name: props.rutaBase + '-asignar' },
        icon: 'lucide-user-check'
      }]
      : [],
    ...props.solicitud.permisos.reenviar
      ? [{
        title: 'Reenviar',
        to: { name: props.rutaBase + '-reenviar' },
        icon: 'lucide-forward'
      }]
      : [],
    ...props.solicitud.permisos.responder
      ? [{
        title: 'Responder',
        to: { name: props.rutaBase + '-responder' },
        icon: 'lucide-reply'
      }]
      : [],
    ...props.solicitud.permisos.aprobar
      ? [{
        title: 'Aprobar',
        to: { name: props.rutaBase + '-aprobar' },
        icon: 'lucide-check-check'
      }]
      : [],
    ...props.solicitud.permisos.evaluar
      ? [{
        title: 'Evaluar',
        to: { name: props.rutaBase + '-evaluar' },
        icon: 'lucide-star'
      }]
      : [],
    { divider: true },
    {
      title: 'Registro',
      to: { name: props.rutaBase + '-registro' },
      icon: 'lucide-clock-fading'
    },
    {
      title: 'Notas',
      to: { name: props.rutaBase + '-notas' },
      icon: 'lucide-sticky-note',
      badge: props.solicitud.cant_nota
    },
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