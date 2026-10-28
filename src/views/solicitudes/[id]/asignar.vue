<script setup lang="ts">
const props = defineProps({
  back: Function
})

import SeleccionarTipo from '@/components/features/solicitudes/[id]/SeleccionarTipo.vue'
import { isValidationError } from '@/api/client'
import { useSolicitudUpdate } from '@/stores/solicitudes'
import { useTramitadoresQuery } from '@/stores/tramitadores'
import { SolicitudDetalle, SolicitudAsignada } from '@/types/models'
import { ref, computed, onMounted, inject, Ref } from 'vue'

const model = ref(false)
const solicitud = inject<Ref<SolicitudDetalle>>('solicitud:solicitud')
const form = ref<SolicitudAsignada>({
  id: solicitud.value.id,
  tramitador: solicitud.value.tramitador?.id,
  tipo: solicitud.value.tipo?.id
})
const errors = ref<any>({})
const errorState = computed(() => ({
  tramitador: {
    state: errors.value.tramitador ? false : null,
    invalidFeedback: errors.value.tramitador,
    onInput: () => errors.value.tramitador = null
  },
}))
const { tramitadores } = useTramitadoresQuery()
const { mutateAsync: actualizarSolicitud, asyncStatus } = useSolicitudUpdate()
const loading = computed(() => asyncStatus.value === 'loading')

onMounted(() => model.value = true)

function validate() {
  errors.value = {}
  if (!form.value.tramitador) errors.value.tramitador = 'Seleccione un valor.'
  return !Object.keys(errors.value).length
}
const submit = () => {
  if (!validate()) return
  actualizarSolicitud(form.value)
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
      <SeleccionarTipo down v-model="form.tipo" />
    </template>
  </BModal>
</template>