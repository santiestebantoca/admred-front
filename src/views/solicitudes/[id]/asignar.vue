<script setup>
const props = defineProps({
  solicitudId: Number,
  back: Function
})

import TipoWidget from '@/components/features/solicitudes/[id]/TipoWidget.vue'
import { isValidationError } from '@/api/client'
import { useSolicitudQuery, useSolicitudUpdate } from '@/stores/solicitudes'
import { useTramitadoresQuery } from '@/stores/tramitadores'
import { ref, computed, watchEffect, onMounted } from 'vue'

const model = ref(false)
const form = ref({
  tramitador: null,
  tipo: null
})
const errors = ref({})
const { tramitadores, isPending: tramitadoresPendientes } = useTramitadoresQuery()
const { solicitud, isPending: solicitudPendiente } = useSolicitudQuery()
const { mutateAsync: actualizarSolicitud, asyncStatus } = useSolicitudUpdate()
const loading = computed(() => asyncStatus.value === 'loading')

watchEffect(() => {
  if (solicitud.value) {
    form.value.tramitador = solicitud.value.tramitador?.id
    form.value.tipo = solicitud.value.tipo?.id
  }
})
onMounted(() => model.value = true)

function validate() {
  const errors = {}
  if (!form.value.tramitador) errors.tramitador = 'Seleccione un valor'
  return !Object.keys(errors).length
}
const submit = async () => {
  if (!validate()) return
  const payload = { id: solicitud.value.id, ...form.value }
  actualizarSolicitud(payload)
    .then(() => model.value = false)
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al actualizar la solicitud.'
    })
}
</script>

<template>
  <BModal v-model="model" @hidden="back" title="Asignar">
    <form @submit.prevent>
      <div class="mb-3">
        <label class="form-label">Tramitador</label>
        <BFormSelect v-model="form.tramitador" :options="tramitadores" value-field="id" text-field="name" />
        <div class="small text-danger">{{ errors.tramitador }}</div>
      </div>
    </form>
    <template #footer>
      <BButton @click="submit" :loading="loading" loading-fill class="w-90 me-3" variant="primary">
        Asignar
      </BButton>
      <TipoWidget down v-model:error="errors.tipo" v-model:value="form.tipo" />
    </template>
  </BModal>
</template>