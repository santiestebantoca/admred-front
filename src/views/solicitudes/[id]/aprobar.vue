<script setup lang="ts">
const props = defineProps({
  solicitudId: Number,
  back: Function
})

import AprobadoRadioSet from '@/components/features/solicitudes/[id]/AprobadoRadioSet.vue'
import DesaprobadoTextarea from '@/components/features/solicitudes/[id]/DesaprobadoTextarea.vue'
import { isValidationError } from '@/api/client'
import { useSolicitudUpdate } from '@/stores/solicitudes'
import type { SolicitudAprobada } from '@/types/models.js'
import { ref, computed, onMounted } from 'vue'

const model = ref(false)
const form = ref<SolicitudAprobada>({
  aprobado: null,
  nota: null,
})
const errors = ref<Record<string, any>>({})
const requiresNota = computed(() => form.value.aprobado === '0')
const { mutateAsync: actualizarSolicitud, asyncStatus } = useSolicitudUpdate()
const loading = computed(() => asyncStatus.value === 'loading')

onMounted(() => model.value = true)

const validate = () => {
  errors.value = {}
  if (!form.value.aprobado) errors.value.aprobado = 'Debe seleccionar una opción'
  if (requiresNota.value && !form.value.nota) errors.value.nota = 'Este campo no puede estar vacío'
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
      <form @submit.prevent>
        <AprobadoRadioSet v-model:error="errors.aprobado" v-model:value="form.aprobado" />
        <DesaprobadoTextarea v-if="requiresNota" v-model:error="errors.nota" v-model:value="form.nota" />
      </form>
    </div>
    <template #footer>
      <BButton @click="submit" :loading="loading" loading-fill class="w-110 me-3" variant="primary">
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