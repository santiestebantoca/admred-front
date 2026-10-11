<script setup lang="ts">
const props = defineProps({
  back: Function
})

import SeleccionarDestino from '@/components/features/solicitudes/[id]/SeleccionarDestino.vue'
import SeleccionarAdjuntos from '@/components/features/solicitudes/[id]/SeleccionarAdjuntos.vue'
import SeleccionarTipo from '@/components/features/solicitudes/[id]/SeleccionarTipo.vue'
import SeleccionarCumplir from '@/components/features/solicitudes/[id]/SeleccionarCumplir.vue'
import { isValidationError } from '@/api/client'
import { useSolicitudCreate } from '@/stores/solicitudes'
import type { SolicitudCreate } from '@/types/models.js'
import { useToast } from 'bootstrap-vue-next'
import { ref, computed, onMounted, useTemplateRef } from 'vue'

const model = ref(false)
const toast = useToast()
const adjuntos = useTemplateRef('adjuntosRef') // DOM
const form = ref<SolicitudCreate>({
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
    invalidFeedback: errors.value.destino
  },
  objetivo: {
    state: errors.value.objetivo ? false : null,
    invalidFeedback: errors.value.objetivo
  },
}))
const { mutateAsync: crearSolicitud, asyncStatus } = useSolicitudCreate()
const loading = computed(() => asyncStatus.value === 'loading')

onMounted(() => model.value = true)

const validate = () => {
  errors.value = {}
  if (!form.value.destino) errors.value.destino = 'Seleccione un área válida'
  if (!form.value.objetivo) errors.value.objetivo = 'Este campo no puede estar vacío'
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
  <BModalPlus v-model="model" title="Crear solicitud" capsule-title="Crear solicitud" @hidden="back" size="lg"
    fullscreen="sm" :scrollable="false">
    <BForm id="form-solicitud-crear" @submit.prevent="submit" density="3">
      <SeleccionarDestino v-model="form.destino" v-bind="errorState.destino" @input="errors.destino = null" />
      <BFormGroup v-bind="errorState.objetivo">
        <BFormTextarea v-model="form.objetivo" no-resize placeholder="Objetivo o alcance de la demanda" rows="8"
          class="lizo" @input="errors.objetivo = null" />
      </BFormGroup>
      <SeleccionarAdjuntos ref="adjuntosRef" v-model="form.adjuntos" />
    </BForm>
    <template #footer>
      <BButton type="submit" form="form-solicitud-crear" :loading="loading" loading-fill class="w-90 me-3"
        variant="primary">
        Crear
      </BButton>
      <BButton @click="adjuntos.select()" v-tippy="'Adjuntar documento'" variant="footer">
        <ILucidePaperclip class="center" :class="{ 'text-primary': form.adjuntos?.length }" />
      </BButton>
      <SeleccionarTipo v-model="form.tipo" />
      <SeleccionarCumplir v-model="form.cumplir_en" />
    </template>
  </BModalPlus>
</template>