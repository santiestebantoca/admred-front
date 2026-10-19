<script setup lang="ts">
const props = defineProps({ back: Function })

import SeleccionarDestino from '@/components/features/solicitudes/[id]/SeleccionarDestino.vue'
import SeleccionarAdjuntos from '@/components/features/solicitudes/[id]/SeleccionarAdjuntos.vue'
import SeleccionarTipo from '@/components/features/solicitudes/[id]/SeleccionarTipo.vue'
import SeleccionarCumplir from '@/components/features/solicitudes/[id]/SeleccionarCumplir.vue'
import { isValidationError } from '@/api/client'
import { useTextLimit } from '@/composables/useTextLimit'
import { useSolicitudQuery, useSolicitudCreate } from '@/stores/solicitudes'
import type { SolicitudCreateFromParent } from '@/types/models.js'
import { useToast } from 'bootstrap-vue-next'
import { ref, computed, onMounted, useTemplateRef, watchEffect } from 'vue'

const model = ref(false)
const toast = useToast()
const adjuntos = useTemplateRef('adjuntosRef')
const form = ref<SolicitudCreateFromParent>({
  padre: null,
  destino: null,
  objetivo: null,
  adjuntos: [],
  tipo: null,
  cumplir_en: null
})
const errors = ref<Record<string, any>>({})
const errorState = computed(() => ({
  destino: {
    state: errors.value.destino ? false : null,
    invalidFeedback: errors.value.destino,
    onInput: () => errors.value.destino = null
  },
  objetivo: {
    state: errors.value.objetivo ? false : null,
    invalidFeedback: errors.value.objetivo,
    onInput: () => errors.value.objetivo = null
  },
}))
const adjuntosHeredados = ref([])
const { solicitud, isPending: solicitudPendiente } = useSolicitudQuery()
const { mutateAsync: crearSolicitud, asyncStatus } = useSolicitudCreate()
const loading = computed(() => asyncStatus.value === 'loading')

const objetivo = computed({
  get: () => form.value.objetivo,
  set: valor => { form.value.objetivo = valor }
})
const {
  max: maxObjetivo,
  largo: objetivoLength,
  aviso: avisoObjetivo,
  tope: topeObjetivo,
  registrarHeredado,
  formatear: formatearObjetivo,
  alTerminarComposicion: alTerminarComposicionObjetivo,
  validar: validarObjetivo
} = useTextLimit(objetivo)
const PLACEHOLDER_OBJETIVO = `Objetivo o alcance de la demanda (máximo ${maxObjetivo} caracteres)`

watchEffect(() => {
  if (solicitud.value) {
    form.value.padre = solicitud.value.id
    form.value.objetivo = solicitud.value.objetivo
    registrarHeredado(solicitud.value.objetivo)
    form.value.tipo = solicitud.value.tipo?.id
    form.value.cumplir_en = solicitud.value.cumplir_en?.slice(0, 10)
    adjuntosHeredados.value = solicitud.value.adjuntos_solicitud
  }
})
onMounted(() => model.value = true)

const validate = () => {
  errors.value = {}
  if (!form.value.destino) errors.value.destino = 'Seleccione un área válida.'
  if (!form.value.objetivo) errors.value.objetivo = 'Este campo no puede estar vacío.'
  else if (!validarObjetivo(form.value.objetivo))
    errors.value.objetivo = `El objetivo no puede superar los ${topeObjetivo.value} caracteres`
  return !Object.keys(errors.value).length
}
const submit = async () => {
  if (!validate()) return
  crearSolicitud(form.value)
    .then(() => {
      toast.create({ body: 'Nueva solicitud creada.', variant: 'success' })
      model.value = false
    })
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al crear la solicitud.'
    })
}
</script>

<template>
  <BModalPlus v-model="model" title="Nueva solicitud (Reenviada)" capsule-title="Nueva solicitud" @hidden="back"
    size="lg" fullscreen="sm" :scrollable="false">
    <div v-if="solicitudPendiente" class="py-5 my-5 text-center">
      <BSpinner />
    </div>
    <template v-else>
      <BForm id="form-reenviar" @submit.prevent="submit" density="3">
        <SeleccionarDestino v-model="form.destino" v-bind="errorState.destino" />
        <BFormGroup v-bind="errorState.objetivo">
          <BFormTextarea v-model="form.objetivo" no-resize :placeholder="PLACEHOLDER_OBJETIVO"
            :formatter="formatearObjetivo" @compositionend="alTerminarComposicionObjetivo"
            aria-describedby="objetivo-ayuda" rows="8" class="lizo" />
          <div id="objetivo-ayuda" class="d-flex justify-content-between gap-2 mt-1 small">
            <span class="text-danger fw-semibold" aria-live="polite">{{ avisoObjetivo }}</span>
            <span class="ms-auto text-nowrap"
              :class="objetivoLength >= maxObjetivo ? 'text-danger fw-semibold' : 'text-secondary'">
              {{ objetivoLength }}/{{ maxObjetivo }}
            </span>
          </div>
        </BFormGroup>
        <SeleccionarAdjuntos ref="adjuntosRef" v-model="form.adjuntos" v-model:adjuntosHeredados="adjuntosHeredados" />
      </BForm>
    </template>
    <template #footer>
      <BButton type="submit" form="form-reenviar" :loading="loading" loading-fill variant="primary w-90 me-3">
        Enviar
      </BButton>
      <BButton @click="adjuntos.select()" v-tippy="'Adjuntar documento'" variant="footer">
        <ILucidePaperclip class="center" :class="{ 'text-primary': form.adjuntos?.length }" />
      </BButton>
      <SeleccionarTipo v-model="form.tipo" />
      <SeleccionarCumplir v-model="form.cumplir_en" />
    </template>
  </BModalPlus>
</template>