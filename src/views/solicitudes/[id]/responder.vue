<script setup lang="ts">
const props = defineProps({
  back: Function
})

import ObservacionesTextarea from '@/components/features/solicitudes/[id]/ObservacionesTextarea.vue'
import AdjuntosWidget from '@/components/features/solicitudes/[id]/AdjuntosWidget.vue'
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
    errors.value.observaciones = 'Este campo no puede estar vacío si no se ha adjuntado un documento'
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
      <form @submit.prevent>
        <ObservacionesTextarea v-model:error="errors.objetivo" v-model:value="form.observaciones" class="mx-n2" />
        <AdjuntosWidget ref="adjuntosRef" v-model="form.adjuntos" v-model:adjuntosHeredados="adjuntosHeredados" />
      </form>
    </template>
    <template #footer>
      <BButton @click="submit" :loading="loading" loading-fill class="w-110 me-3" variant="primary">
        Responder
      </BButton>
      <BButton @click="adjuntos.select()" v-tippy="'Adjuntar documento'" variant="footer">
        <IBiPaperclip class="center" :class="{ 'text-primary': form.adjuntos?.length }" />
      </BButton>
    </template>
  </BModalPlus>
</template>
