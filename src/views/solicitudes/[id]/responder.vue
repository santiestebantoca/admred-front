<script setup lang="ts">
const props = defineProps({
  back: Function
})

import SeleccionarAdjuntos from '@/components/features/solicitudes/[id]/SeleccionarAdjuntos.vue'
import { isValidationError } from '@/api/client'
import { useSolicitudQuery, useSolicitudUpdate } from '@/stores/solicitudes'
import type { SolicitudRespondida } from '@/types/models.js'
import { ref, computed, onMounted, useTemplateRef, watchEffect } from 'vue'

const model = ref(false)
const adjuntos = useTemplateRef('adjuntosRef')
const form = ref<SolicitudRespondida>({
  observaciones: null,
  adjuntos: [],
})
const errors = ref<Record<string, any>>({})
const errorState = computed(() => ({
  observaciones: {
    state: errors.value.observaciones ? false : null,
    invalidFeedback: errors.value.observaciones,
    onInput: () => errors.value.observaciones = null
  },
}))
const adjuntosHeredados = ref([])
const { solicitud, isPending: solicitudPendiente } = useSolicitudQuery()
const { mutateAsync: actualizarSolicitud, asyncStatus } = useSolicitudUpdate()
const loading = computed(() => asyncStatus.value === 'loading')

watchEffect(() => {
  if (solicitud.value) {
    form.value.observaciones = solicitud.value.observaciones
    adjuntosHeredados.value = solicitud.value.adjuntos_respuesta
  }
})
onMounted(() => model.value = true)

const validate = () => {
  errors.value = {}
  if (!form.value.observaciones && !form.value.adjuntos.length)
    errors.value.observaciones = 'Este campo no puede estar vacío.'
  return !Object.keys(errors.value).length
}
const submit = async () => {
  if (!validate()) return
  const payload = { id: solicitud.value.id, ...form.value }
  actualizarSolicitud(payload)
    .then(() => model.value = false)
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al responder la solicitud.'
    })
}
</script>

<template>
  <BModalPlus v-model="model" @hidden="back" title="Responder solicitud" capsule-title="Responder solicitud" size="lg"
    fullscreen="sm" :scrollable="false">
    <div v-if="solicitudPendiente" class="py-5 my-5 text-center">
      <BSpinner />
    </div>
    <template v-else>
      <BForm id="form-responder" @submit.prevent="submit" density="3">
        <BFormGroup v-bind="errorState.observaciones">
          <BFormTextarea v-model="form.observaciones" no-resize placeholder="Observaciones" rows="8" class="lizo" />
        </BFormGroup>
        <SeleccionarAdjuntos ref="adjuntosRef" v-model="form.adjuntos" v-model:adjuntosHeredados="adjuntosHeredados" />
      </BForm>
    </template>
    <template #footer>
      <BButton type="submit" form="form-responder" :loading="loading" loading-fill variant="primary w-110 me-3">
        Responder
      </BButton>
      <BButton @click="adjuntos.select()" v-tippy="'Adjuntar documento'" variant="footer">
        <ILucidePaperclip class="center" :class="{ 'text-primary': form.adjuntos?.length }" />
      </BButton>
    </template>
  </BModalPlus>
</template>
