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
const { mutateAsync: actualizarSolicitud, asyncStatus } = useSolicitudUpdate()
const loading = computed(() => asyncStatus.value === 'loading')

onMounted(() => model.value = true)

const validate = () => {
  errors.value = {}
  if (!form.value.evaluacion) errors.value.evaluacion = 'Seleccione una calificación de 1 a 5'
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
      <form @submit.prevent>
        <BFormRating v-model="form.evaluacion" variant="warning" />
        <div class="small text-danger ps-1" v-text="errors.evaluacion" />
      </form>
    </div>
    <template #footer>
      <BButton @click="submit" :loading="loading" loading-fill class="w-90 me-3" variant="primary">
        Evaluar
      </BButton>
    </template>
  </BModal>
</template>

<style scoped>
.min-height-110 {
  min-height: 110px;
}

:deep(.b-form-rating) {
  width: fit-content;

  :deep(.star) {
    position: relative;
    top: -3px;
  }
}
</style>