<!-- Adjuntos
1. Before submit,
   / calculate and execute attachment deletions (from data and AdjuntosSelf)
   / calculate form.adjuntos (from AdjuntosSelf and AdjuntosWidget)
-->
<script setup>
import useHandleSubmit from '@/use/useHandleSubmit.js'
import useWebSocketAlt from '@/use/useWebSocketAlt.js'
import useItemStore from '@/stores/item'
import ObservacionesTextarea from '../inputs/ItemObservacionesTextarea.vue'
import AdjuntosSelf from '../inputs/ItemAdjuntosSelf.vue'
import AdjuntosWidget from '../../AdjuntosWidget.vue/index.js'
import { ref, computed, watch } from 'vue'

const process = useHandleSubmit()
const { handlePost } = useWebSocketAlt()
const item = useItemStore()
const sending = ref(false)
const result = ref({ errors: {} })
const dialog = ref(true)
const form = ref({
  observaciones: null,
  adjuntos: []
})
const adjuntos = ref(null) // DOM
const adjuntosSelf = ref(null) // DOM
const data = computed(() => item.data)
watch(data, d => {
  form.value = { observaciones: d.observaciones }
}, { immediate: true })
function validate() {
  const errors = {}
  if (!form.value.observaciones && !form.value.adjuntos.length)
    errors.observaciones = 'Este campo no puede estar vacío si no se ha adjuntado un documento'
  result.value = { errors }
  return !Object.keys(errors).length
}
function submit() {
  if (!validate()) return
  sending.value = true
  adjuntosSelf.value.sync() // execute attachment deletions if any
  form.value.adjuntos = adjuntos.value.ids() // adjuntos
  item.put({ id: item.data.id, data: form.value }).then(res => process.PUT(res.data, accepted, errors))
}
function accepted() {
  dialog.value = false
  handlePost({ action: 'reply' })
}
const errors = () => sending.value = false
</script>

<template>
  <bs-dialog v-model="dialog" @hidden="$emit('close')" lg fullSmDown>
    <bs-dialog-header label="Responder solicitud" />
    <bs-dialog-body>
      <form @submit.prevent>
        <ObservacionesTextarea v-model:error="result.errors.observaciones" v-model:value="form.observaciones" />
        <AdjuntosSelf ref="adjuntosSelf" v-model:self="data.adjuntos_respuesta" class="mb-1" />
        <AdjuntosWidget ref="adjuntos" />
      </form>
    </bs-dialog-body>
    <bs-dialog-footer start>
      <bs-btn-send :active="sending" @click="submit" />
      <bs-btn-icon flat @click="$refs.adjuntos.select()" icon="paperclip" style="font-size:20px">
        <bs-tooltip placement="top" offset="0,10">Adjuntar documento</bs-tooltip>
      </bs-btn-icon>
    </bs-dialog-footer>
    <bs-dialog-capsule label="Responder solicitud" />
  </bs-dialog>
</template>
