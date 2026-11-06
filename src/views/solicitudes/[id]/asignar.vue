<script setup lang="ts">
const props = defineProps({
  back: Function
})

import type { ErroresDeValidacion } from '@/types/api'
import SeleccionarTipo from '@/components/features/solicitudes/[id]/SeleccionarTipo.vue'
import BotonEnvio from '@/components/commons/BotonEnvio.vue'
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
const errors = ref<ErroresDeValidacion>({})
const errorState = computed(() => ({
  tramitador: {
    state: errors.value.tramitador ? false : null,
    invalidFeedback: errors.value.tramitador,
    onInput: () => errors.value.tramitador = null
  },
}))
const { options: tramitadores } = useTramitadoresQuery()
const { mutateAsync: actualizarSolicitud, asyncStatus } = useSolicitudUpdate()
const loading = computed(() => asyncStatus.value === 'loading')

onMounted(() => model.value = true)

function validate() {
  errors.value = {}
  if (!form.value.tramitador) errors.value.tramitador = 'Seleccione un valor.'
  return !Object.keys(errors.value).length
}
const submit = () => {
  if (loading.value || !validate()) return
  actualizarSolicitud(form.value)
    .then(() => model.value = false)
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al actualizar la solicitud.'
    })
}
</script>

<template>
  <BModal v-model="model" @hidden="back()" title="Asignar"
    :no-close-on-backdrop="loading" :no-close-on-esc="loading">
    <BForm id="form-asignar" @submit.prevent="submit" density="3" :aria-busy="loading">
      <BFormGroup label="Tramitador" v-bind="errorState.tramitador">
        <BFormSelect v-model="form.tramitador" :options="tramitadores" />
      </BFormGroup>
    </BForm>
    <template #footer>
      <BotonEnvio type="submit" form="form-asignar" :loading="loading" loading-fill texto-cargando="Asignando…"
        variant="primary w-90 me-3">
        Asignar
      </BotonEnvio>
      <SeleccionarTipo down v-model="form.tipo" />
    </template>
  </BModal>
</template>