<script setup lang="ts">
const props = defineProps({
  solicitudId: Number,
  back: Function
})

import { isValidationError } from '@/api/client'
import { useTextLimit } from '@/composables/useTextLimit'
import { useSolicitudUpdate } from '@/stores/solicitudes'
import type { SolicitudAprobada } from '@/types/models.js'
import { ref, computed, onMounted } from 'vue'

const model = ref(false)
const form = ref<SolicitudAprobada>({
  aprobado: null,
  nota: null,
})
const errors = ref<Record<string, any>>({})
const errorState = computed(() => ({
  aprobado: {
    state: errors.value.aprobado ? false : null,
    invalidFeedback: errors.value.aprobado,
    onInput: () => errors.value.aprobado = null
  },
  nota: {
    state: errors.value.nota ? false : null,
    invalidFeedback: errors.value.nota,
    onInput: () => errors.value.nota = null
  },
}))
const requiresNota = computed(() => form.value.aprobado === '0')
const { mutateAsync: actualizarSolicitud, asyncStatus } = useSolicitudUpdate()
const loading = computed(() => asyncStatus.value === 'loading')

const nota = computed({
  get: () => form.value.nota,
  set: valor => { form.value.nota = valor }
})
const {
  max: maxNota,
  largo: notaLength,
  aviso: avisoNota,
  tope: topeNota,
  formatear: formatearNota,
  alTerminarComposicion: alTerminarComposicionNota,
  validar: validarNota
} = useTextLimit(nota)
const PLACEHOLDER_NOTA = `* (Obligatorio) Escriba los motivos para desaprobar esta respuesta (máximo ${maxNota} caracteres)`

onMounted(() => model.value = true)

const validate = () => {
  errors.value = {}
  if (!form.value.aprobado) errors.value.aprobado = 'Debe seleccionar una opción.'
  if (requiresNota.value && !form.value.nota) errors.value.nota = 'Este campo no puede estar vacío.'
  else if (!validarNota(form.value.nota))
    errors.value.nota = `La nota no puede superar los ${topeNota.value} caracteres`
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
  <BModal v-model="model" @hidden="back" title="Aprobar respuesta" size="lg" fullscreen="sm" :scrollable="false">
    <div class="min-height-120">
      <p>Aprobar o desaprobar la respuesta del tramitador.</p>
      <BForm id="form-aprobar" @submit.prevent="submit" density="3">
        <BFormRadioGroup v-model="form.aprobado" stacked density="2" :options="[
          { text: 'Aprobar respuesta del tramitador', value: '1' },
          { text: 'Desaprobar respuesta del tramitador', value: '0' },
        ]" v-bind="errorState.aprobado" />
        <BFormGroup v-if="requiresNota" v-bind="errorState.nota">
          <BFormTextarea v-model="form.nota" no-resize :placeholder="PLACEHOLDER_NOTA"
            :formatter="formatearNota" @compositionend="alTerminarComposicionNota"
            aria-describedby="nota-ayuda" rows="8" class="lizo" />
          <div id="nota-ayuda" class="d-flex justify-content-between gap-2 mt-1 small">
            <span class="text-danger fw-semibold" aria-live="polite">{{ avisoNota }}</span>
            <span class="ms-auto text-nowrap"
              :class="notaLength >= maxNota ? 'text-danger fw-semibold' : 'text-secondary'">
              {{ notaLength }}/{{ maxNota }}
            </span>
          </div>
        </BFormGroup>
      </BForm>
    </div>
    <template #footer>
      <BButton type="submit" form="form-aprobar" :loading="loading" loading-fill variant="primary w-110 me-3">
        {{ form.aprobado === '0' ? 'Desaprobar' : 'Aprobar' }}
      </BButton>
    </template>
  </BModal>
</template>

<style scoped>
.min-height-120 {
  min-height: 120px;
}
</style>