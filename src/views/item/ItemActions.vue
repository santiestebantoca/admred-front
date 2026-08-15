<script setup>
const props = defineProps({
  horizontal: Boolean
})

import useAuthStore from '@/stores/auth'
import useItemStore from '@/stores/item'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()
const item = useItemStore()
const data = computed(() => item.data)
const authUser = computed(() => useAuthStore().authUser)
const items = computed(() => {
  if (!data.value) return []
  const im = {
    supervisor: data.value.destino.id === authUser.value.area && authUser.value.supervisor,
    tramitador: data.value.tramitador && data.value.tramitador.id === authUser.value.id,
    demandante: data.value.remitente.id === authUser.value.id
  }

  const assign = data.value.estado.id < 3 && im.supervisor
  const forward =
    (data.value.estado.id === 2 && im.tramitador) || (data.value.estado.id === 1 && im.supervisor) // for Kevin to save a click
  const reply = data.value.estado.id === 2 && im.tramitador
  const approve =
    data.value.estado.id === 3 &&
    data.value.supervisor &&
    data.value.supervisor.id === authUser.value.id
  const rate = data.value.estado.id === 4 && !data.value.evaluacion && im.demandante

  const items = []
  // Assign
  assign &&
    items.push({
      title: 'Asignar',
      action: 'assign',
      icon: 'person'
    })
  // Forward
  forward &&
    items.push({
      title: 'Reenviar',
      action: 'forward',
      icon: 'forward'
    })
  // Reply
  reply &&
    items.push({
      title: 'Responder',
      action: 'reply',
      icon: 'reply'
    })
  // Approve
  approve &&
    items.push({
      title: 'Aprobar',
      action: 'approve',
      icon: 'patch-check'
    })
  // Rate
  rate &&
    items.push({
      title: 'Calificar',
      action: 'rate',
      icon: 'star'
    })
  // Divider
  items.push({
    divider: true
  })
  // Record
  items.push({
    title: 'Registro',
    action: 'record',
    icon: 'clock-history'
  })
  // Note
  items.push({
    title: 'Notas',
    action: 'note',
    icon: 'sticky',
    ...(data.value.cant_nota ? { badge: data.value.cant_nota } : {})
  })
  return items
})
const go = action => {
  router.replace({ query: { ...route.query, action } })
  emit('action')
}
const emit = defineEmits(['action'])
</script>

<template>
  <div v-if="horizontal" class="hstack">
    <div v-for="item in items" :key="item.title">
      <bs-btn v-if="!item.divider" @click="go(item.action)" flat class="w-100 hstack gap-2">
        <bs-icon :name="item.icon" />
        <span v-text="item.title" class="small" />
        <span v-if="item.badge" class="text-secondary">
          ({{ item.badge }})
        </span>
      </bs-btn>
    </div>
  </div>
  <div v-else class="vh-100 p-2">
    <div v-for="item in items" :key="item.title">
      <hr v-if="item.divider" class="mx-2" />
      <bs-btn v-else @click="go(item.action)" flat class="w-100 hstack gap-2">
        <bs-icon :name="item.icon" />
        <span v-text="item.title" class="small" />
        <span v-if="item.badge" v-text="item.badge" class="text-secondary ms-auto" />
      </bs-btn>
    </div>
  </div>
</template>