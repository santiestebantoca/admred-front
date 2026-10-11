<script setup lang="ts">
const props = defineProps({
  solicitudId: Number,
  back: Function
})

import { isValidationError } from '@/api/client'
import { useSolicitudUpdate } from '@/stores/solicitudes'
import type { SolicitudEvaluada } from '@/types/models.js'
import { ref, computed, onMounted } from 'vue'

const model = ref(false)
const form = ref<SolicitudEvaluada>({
  evaluacion: 0,
})
const errors = ref<Record<string, any>>({})
const errorState = computed(() => ({
  evaluacion: {
    state: errors.value.evaluacion ? false : null,
    invalidFeedback: errors.value.evaluacion
  },
}))
const { mutateAsync: actualizarSolicitud, asyncStatus } = useSolicitudUpdate()
const loading = computed(() => asyncStatus.value === 'loading')

onMounted(() => model.value = true)

const validate = () => {
  errors.value = {}
  if (!form.value.evaluacion) errors.value.evaluacion = 'Seleccione una calificación.'
  return !Object.keys(errors.value).length
}
const submit = async () => {
  if (!validate()) return
  const payload = { id: props.solicitudId, ...form.value }
  actualizarSolicitud(payload)
    .then(() => model.value = false)
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al responder la solicitud.'
    })
}
</script>

<template>
  <BModal v-model="model" @hidden="back" title="Evaluar" fullscreen="sm" :scrollable="false">
    <div class="min-height-110">
      <p>Evaluación de la respuesta recibida.</p>
      <BForm id="form-evaluar" @submit.prevent="submit" density="3">
        <BFormGroup v-bind="errorState.evaluacion">
          <BFormRating v-model="form.evaluacion" variant="warning" @update:model-value="errors.evaluacion = null" />
        </BFormGroup>
      </BForm>
    </div>
    <template #footer>
      <BButton type="submit" form="form-evaluar" :loading="loading" loading-fill variant="primary w-90 me-3">
        Evaluar
      </BButton>
    </template>
  </BModal>
</template>

<style scoped>
/* .min-height-110 {
  min-height: 110px;
} */

:deep(.b-form-rating) {
  width: fit-content;

  :deep(.star) {
    position: relative;
    top: -3px;
  }
}
</style>