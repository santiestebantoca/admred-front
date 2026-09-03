<script setup lang="ts">
const props = defineProps({ back: Function })

import DestinoSelect from '@/components/features/solicitudes/[id]/DestinoSelect.vue'
import ObjetivoTextarea from '@/components/features/solicitudes/[id]/ObjetivoTextarea.vue'
import AdjuntosWidget from '@/components/features/solicitudes/[id]/AdjuntosWidget.vue'
import TipoWidget from '@/components/features/solicitudes/[id]/TipoWidget.vue'
import CumplirWidget from '@/components/features/solicitudes/[id]/CumplirWidget.vue'
import { isValidationError } from '@/api/client'
import { useSolicitudCreate } from '@/stores/solicitudes'
import type { SolicitudCreate } from '@/types/models.js'
import { useToast } from 'bootstrap-vue-next'
import { ref, computed, onMounted, useTemplateRef } from 'vue'

const model = ref(false)
const toast = useToast()
const { mutateAsync: crearSolicitud, asyncStatus } = useSolicitudCreate()
const loading = computed(() => asyncStatus.value === 'loading')
const adjuntos = useTemplateRef('adjuntosRef') // DOM
const form = ref<SolicitudCreate>({
  destino: null,
  objetivo: null,
  adjuntos: [],
  tipo: null,
  cumplir_en: null
})
const errors = ref<Record<string, any>>({})

onMounted(() => model.value = true)

const validate = () => {
  errors.value = {}
  if (!form.value.destino) errors.value.destino = 'Seleccione un área válida'
  if (!form.value.objetivo) errors.value.objetivo = 'Este campo no puede estar vacío'
  return !Object.keys(errors.value).length
}
const submit = async () => {
  if (!validate()) return
  // form.value.adjuntos = adjuntos.value.ids() // adjuntos (prueba con v-model)
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
  <BModal v-model="model" title="Crear solicitud" @hidden="back" size="lg" fullscreen="sm" :scrollable="false"
    class="crear-solicitud-root">
    <form @submit.prevent>
      <DestinoSelect v-model:error="errors.destino" v-model:value="form.destino" />
      <ObjetivoTextarea v-model:error="errors.objetivo" v-model:value="form.objetivo" class="mx-n2" />
      <AdjuntosWidget ref="adjuntosRef" v-model="form.adjuntos" />
    </form>
    <template #footer>
      <BButton @click="submit" :loading="loading" loading-fill class="w-90 me-3" variant="primary">
        Crear
      </BButton>
      <BButton @click="adjuntos.select()" v-tippy="'Adjuntar documento'" variant="footer">
        <UIcon name="bi-paperclip" class="center" :class="{ 'text-primary': form.adjuntos?.length }" />
      </BButton>
      <TipoWidget v-model:error="errors.tipo" v-model:value="form.tipo" />
      <CumplirWidget v-model:error="errors.cumplir_en" v-model:value="form.cumplir_en" />
    </template>
  </BModal>
</template>

<style scoped lang="scss">
.btn-footer,
:deep(.btn-footer) {
  width: 34px;
  height: 34px;
  border-color: transparent !important;
  // --bs-btn-bg: var(--bs-gray-100);
  --bs-btn-hover-bg: var(--bs-gray-200);
  --bs-btn-active-bg: var(--bs-gray-200);
  --bs-btn-active-border-color: var(--bs-gray-300);

}
</style>