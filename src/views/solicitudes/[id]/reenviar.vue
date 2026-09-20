<script setup lang="ts">
const props = defineProps({ back: Function })

import DestinoSelect from '@/components/features/solicitudes/[id]/DestinoSelect.vue'
import ObjetivoTextarea from '@/components/features/solicitudes/[id]/ObjetivoTextarea.vue'
import AdjuntosWidget from '@/components/features/solicitudes/[id]/AdjuntosWidget.vue'
import TipoWidget from '@/components/features/solicitudes/[id]/TipoWidget.vue'
import CumplirWidget from '@/components/features/solicitudes/[id]/CumplirWidget.vue'
import { isValidationError } from '@/api/client'
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
const adjuntosHeredados = ref([])
const { solicitud, isPending: solicitudPendiente } = useSolicitudQuery()
const { mutateAsync: crearSolicitud, asyncStatus } = useSolicitudCreate()
const loading = computed(() => asyncStatus.value === 'loading')

watchEffect(() => {
  if (solicitud.value) {
    form.value.padre = solicitud.value.id
    form.value.objetivo = solicitud.value.objetivo
    form.value.tipo = solicitud.value.tipo?.id
    form.value.cumplir_en = solicitud.value.cumplir_en?.slice(0, 10)
    adjuntosHeredados.value = solicitud.value.adjuntos_solicitud
  }
})
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
  <BModal v-model="model" title="Crear solicitud (Reenviada)" @hidden="back" size="lg" fullscreen="sm"
    :scrollable="false">
    <div v-if="solicitudPendiente" class="py-5 my-5 text-center">
      <BSpinner />
    </div>
    <template v-else>
      <form @submit.prevent>
        <DestinoSelect v-model:error="errors.destino" v-model:value="form.destino" />
        <ObjetivoTextarea v-model:error="errors.objetivo" v-model:value="form.objetivo" class="mx-n2" />
        <AdjuntosWidget ref="adjuntosRef" v-model="form.adjuntos" v-model:adjuntosHeredados="adjuntosHeredados" />
      </form>
    </template>
    <template #footer>
      <BButton @click="submit" :loading="loading" loading-fill class="w-90 me-3" variant="primary">
        Crear
      </BButton>
      <BButton @click="adjuntos.select()" v-tippy="'Adjuntar documento'" variant="footer">
        <IBiPaperclip class="center" :class="{ 'text-primary': form.adjuntos?.length }" />
      </BButton>
      <TipoWidget v-model:error="errors.tipo" v-model:value="form.tipo" />
      <CumplirWidget v-model:error="errors.cumplir_en" v-model:value="form.cumplir_en" />
    </template>
  </BModal>
</template>