<script setup lang="ts">
const props = defineProps({
  back: Function
})

import type { ErroresDeValidacion } from '@/types/api'
import SeleccionarAdjuntos from '@/components/features/solicitudes/[id]/SeleccionarAdjuntos.vue'
import BotonEnvio from '@/components/commons/BotonEnvio.vue'
import { isValidationError } from '@/api/client'
import { useTextLimit } from '@/composables/useTextLimit'
import { useSolicitudUpdate } from '@/stores/solicitudes'
import type { SolicitudRespondida, SolicitudDetalle } from '@/types/models.js'
import { ref, computed, onMounted, useTemplateRef, inject, Ref } from 'vue'

const model = ref(false)
const adjuntos = useTemplateRef('adjuntosRef')
const solicitud = inject<Ref<SolicitudDetalle>>('solicitud:solicitud')
const form = ref<SolicitudRespondida>({
  id: solicitud.value.id,
  observaciones: solicitud.value.observaciones,
  adjuntos: [],
})
const errors = ref<ErroresDeValidacion>({})
const errorState = computed(() => ({
  observaciones: {
    state: errors.value.observaciones ? false : null,
    invalidFeedback: errors.value.observaciones,
    onInput: () => errors.value.observaciones = null
  },
}))
const adjuntosHeredados = ref(solicitud.value.adjuntos_respuesta)
const { mutateAsync: actualizarSolicitud, asyncStatus } = useSolicitudUpdate()
const loading = computed(() => asyncStatus.value === 'loading')
const adjuntosSubiendo = computed(() => Boolean(adjuntos.value?.subiendo))
const enviando = computed(() => loading.value || adjuntosSubiendo.value)

const observaciones = computed({
  get: () => form.value.observaciones,
  set: valor => { form.value.observaciones = valor }
})
const {
  max: maxObservaciones,
  largo: observacionesLength,
  aviso: avisoObservaciones,
  tope: topeObservaciones,
  registrarHeredado,
  formatear: formatearObservaciones,
  alTerminarComposicion: alTerminarComposicionObservaciones,
  validar: validarObservaciones
} = useTextLimit(observaciones)
registrarHeredado(solicitud.value.observaciones)
const PLACEHOLDER_OBSERVACIONES = `Observaciones (máximo ${maxObservaciones} caracteres)`

onMounted(() => model.value = true)

const validate = () => {
  errors.value = {}
  if (!form.value.observaciones && !form.value.adjuntos.length)
    errors.value.observaciones = 'Este campo no puede estar vacío.'
  else if (!validarObservaciones(form.value.observaciones))
    errors.value.observaciones = `Las observaciones no pueden superar los ${topeObservaciones.value} caracteres`
  return !Object.keys(errors.value).length
}
const submit = () => {
  if (enviando.value || !validate()) return
  actualizarSolicitud(form.value)
    .then(() => model.value = false)
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al responder la solicitud.'
    })
}
</script>

<template>
  <BModalPlus v-model="model" @hidden="back()" title="Responder solicitud" capsule-title="Responder solicitud" size="lg"
    fullscreen="sm" :scrollable="false" :no-close-on-backdrop="loading" :no-close-on-esc="loading">
    <BForm id="form-responder" @submit.prevent="submit" density="3" :aria-busy="enviando">
      <BFormGroup v-bind="errorState.observaciones">
        <BFormTextarea v-model="form.observaciones" no-resize :placeholder="PLACEHOLDER_OBSERVACIONES"
          :formatter="formatearObservaciones" @compositionend="alTerminarComposicionObservaciones"
          aria-describedby="observaciones-ayuda" rows="6" class="lizo" />
        <div id="observaciones-ayuda" class="d-flex justify-content-between gap-2 mt-1 small">
          <span class="text-danger fw-semibold" aria-live="polite">{{ avisoObservaciones }}</span>
          <span class="ms-auto text-nowrap"
            :class="observacionesLength >= maxObservaciones ? 'text-danger fw-semibold' : 'text-secondary'">
            {{ observacionesLength }}/{{ maxObservaciones }}
          </span>
        </div>
      </BFormGroup>
      <SeleccionarAdjuntos ref="adjuntosRef" v-model="form.adjuntos" v-model:adjuntosHeredados="adjuntosHeredados" />
    </BForm>
    <template #footer>
      <BotonEnvio type="submit" form="form-responder" :loading="enviando" loading-fill
        :texto-cargando="adjuntosSubiendo && !loading ? 'Subiendo adjuntos…' : 'Enviando respuesta…'"
        variant="primary w-110 me-3">
        Responder
      </BotonEnvio>
      <BButton @click="adjuntos.select()" :disabled="enviando" v-tippy="'Adjuntar documento'" variant="flat wh-34">
        <ILucidePaperclip class="center" :class="{ 'text-primary': form.adjuntos?.length }" />
      </BButton>
    </template>
  </BModalPlus>
</template>
