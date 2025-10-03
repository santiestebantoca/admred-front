<!-- 
  This compo is prepared to be used as wizard component
  Submition is automatic on `membership` change (through an async function)
  Watcher for `membership` feedback, is made to avoid infinite loop!
 -->
<script setup>
const wizard = defineModel()
const props = defineProps({
  id: Number,
  back: Function,
  end: Boolean
})

import useStore from '@/stores/admin-users'
import GruposCheck from '../../base/inputs/UserGruposCheck.vue'
import { ref, watch, inject } from 'vue'

const loading = inject('app:loading')
const store = useStore().user
const form = ref({
  membership: []
})
watch(() => store.data, d => {
  form.value = {
    membership: d.membership?.map(e => e.id)
  }
}, { immediate: true })
watch(() => form.value.membership, (to, from) => {
  if (to.length > from.length) update(to.find(d => !from.includes(d)), 'post')
  else if (from.length > to.length) update(from.find(d => !to.includes(d)), 'del')
})
const update = async (group_id, action) => {
  loading.value++
  await store.membership[action]({
    user_id: props.id,
    group_id
  })
  await store.get(props.id)
  loading.value--
}
</script>

<template>
  <div class="data-box">
    <div v-if="!wizard" class="data-header">
      <bs-btn-back @click="back" />
      <span class="fs-5">Grupos del usuario</span>
    </div>
    <div>
      Un usuario puede crear solicitudes y gestionar las asignadas a él.
      Los grupos debajo, permiten funciones adicionales.
    </div>
    <div>
      <GruposCheck v-model:value="form.membership" />
    </div>
    <div class="pt-4">
      <template v-if="!wizard">
        <bs-btn color="primary" label="Terminar" @click="back" />
      </template>
      <template v-if="wizard">
        <bs-btn v-if="end" color="primary" label="Terminar" @click="wizard++" />
        <bs-btn v-else color="primary" label="Siguiente" @click="wizard++" />
      </template>
    </div>
  </div>
</template>

<style scoped>
:deep(.form-label) {
  font-weight: 600;
  font-size: .875em;
}
</style>
