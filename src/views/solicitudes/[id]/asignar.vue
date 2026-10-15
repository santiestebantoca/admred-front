<script setup>
const props = defineProps({
  solicitudId: Number,
  back: Function
})

import SeleccionarTipo from '@/components/features/solicitudes/[id]/SeleccionarTipo.vue'
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
const errorState = computed(() => ({
  tramitador: {
    state: errors.value.tramitador ? false : null,
    invalidFeedback: errors.value.tramitador,
    onInput: () => errors.value.tramitador = null
  },
}))
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
  errors.value = {}
  if (!form.value.tramitador) errors.value.tramitador = 'Seleccione un valor.'
  return !Object.keys(errors.value).length
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
    <BForm id="form-asignar" @submit.prevent="submit" density="3">
      <BFormGroup label="Tramitador" v-bind="errorState.tramitador">
        <BFormSelect v-model="form.tramitador" :options="tramitadores" value-field="id" text-field="name" />
      </BFormGroup>
    </BForm>
    <template #footer>
      <BButton type="submit" form="form-asignar" :loading="loading" loading-fill variant="primary w-90 me-3">
        Asignar
      </BButton>
      <SeleccionarTipo down v-model="errors.tipo" />
    </template>
  </BModal>
</template>