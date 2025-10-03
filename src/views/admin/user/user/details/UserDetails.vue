<script setup>
const props = defineProps({ back: Function })

import Actions from './DetailsActions.vue'
import useStore from '@/stores/admin-users'
import { computed } from 'vue'

const store = useStore().user
const data = computed(() => store.data)
const data_ = computed(() => [
  ...data.value.registration_key
    ? [{
      label: 'Estado',
      value: data.value.registration_key,
      cls: 'text-danger'
    }]
    : [],
  { label: 'Nombre', value: data.value.name },
  { label: 'Usuario', value: data.value.username },
  { label: 'Email', value: data.value.email },
  { label: 'Tel. móvil', value: data.value.movil || '-' },
  { label: 'Tel. oficina', value: data.value.fijo || '-' },
  { label: 'Área', value: data.value.area.nombre }
])
const membership = computed(() => data.value.membership)
</script>

<template>
  <div class="data-box">
    <div class="data-header">
      <bs-btn-back @click="back" />
      <Actions class="ms-auto" />
    </div>
    <div v-for="{ label, value, cls } in data_" :key="value">
      <label v-text="label" class="data-label" />
      <div v-text="value" :class="cls" class="data-value" />
    </div>
    <div>
      <label class="data-label">Grupos</label>
      <ul class="data-ul">
        <template v-if="membership.length">
          <li v-for="d in membership" :key="d.id" v-text="d.role" class="text-capitalize" />
        </template>
        <li v-else>-</li>
      </ul>
    </div>
    <router-view />
  </div>
</template>
