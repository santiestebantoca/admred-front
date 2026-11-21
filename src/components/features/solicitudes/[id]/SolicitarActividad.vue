<script setup lang="ts">
const props = defineProps({
  back: Function
})
const emit = defineEmits<{ definida: [] }>()

import type { ErroresDeValidacion } from '@/types/api'
import type { ActividadSolicitud } from '@/types/backend'
import type { SolicitudDetalle } from '@/types/models'
import { ACTIVIDADES } from '@/constants'
import { isValidationError } from '@/api/client'
import BotonEnvio from '@/components/commons/BotonEnvio.vue'
import { useNotificaciones } from '@/composables/useNotificaciones'
import { useSolicitudUpdate } from '@/stores/solicitudes'
import { ref, computed, onMounted, inject, type Ref } from 'vue'

const model = ref(false)
// Evita navegar hacia atrás cuando el modal se cierra tras guardar: el detalle
// se invalida y la vista pasa al formulario de la acción.
const guardada = ref(false)
const solicitud = inject<Ref<SolicitudDetalle>>('solicitud:solicitud')
const form = ref<{ id: number; actividad: ActividadSolicitud | null }>({
  id: solicitud.value.id,
  actividad: null,
})
const errors = ref<ErroresDeValidacion>({})
const errorState = computed(() => ({
  actividad: {
    state: errors.value.actividad ? false : null,
    invalidFeedback: errors.value.actividad,
    onInput: () => errors.value.actividad = null
  },
}))
const { mutateAsync: actualizarSolicitud, asyncStatus } = useSolicitudUpdate()
const loading = computed(() => asyncStatus.value === 'loading')
const { exito } = useNotificaciones()

onMounted(() => model.value = true)

const validate = () => {
  errors.value = {}
  if (!form.value.actividad) errors.value.actividad = 'Debe seleccionar una opción.'
  return !Object.keys(errors.value).length
}

const submit = () => {
  if (loading.value || !validate() || !form.value.actividad) return
  actualizarSolicitud({ id: form.value.id, actividad: form.value.actividad })
    .then(() => {
      guardada.value = true
      exito('Actividad definida.')
      emit('definida')
      model.value = false
    })
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al definir la actividad.'
    })
}

const alOcultar = () => {
  if (!guardada.value) props.back?.()
}
</script>

<template>
  <BModal v-model="model" @hidden="alOcultar" title="Actividad de la solicitud" size="lg" fullscreen="sm"
    :no-close-on-backdrop="loading" :no-close-on-esc="loading">
    <div class="min-height-120">
      <p>
        Esta solicitud proviene de un área de los territorios y su destino es el
        grupo de administración. Clasifíquela como actividad de provisión o de
        administración antes de continuar.
      </p>
      <p class="text-secondary small">
        La actividad se define una única vez y no podrá modificarse después.
      </p>
      <BForm id="form-actividad" @submit.prevent="submit" density="3" :aria-busy="loading">
        <BFormRadioGroup v-model="form.actividad" stacked density="2" :options="ACTIVIDADES"
          v-bind="errorState.actividad" />
        <div v-if="errors.form" class="text-danger small" role="alert">{{ errors.form }}</div>
      </BForm>
    </div>
    <template #footer>
      <BotonEnvio type="submit" form="form-actividad" :loading="loading" loading-fill
        texto-cargando="Guardando actividad…" variant="primary w-110 me-3">
        Continuar
      </BotonEnvio>
      <BButton variant="flat" :disabled="loading" @click="model = false">Cancelar</BButton>
    </template>
  </BModal>
</template>

<style scoped>
.min-height-120 {
  min-height: 120px;
}
</style>
