<script setup>
import useItemStore from '@/stores/item'
import DestinoSelect from '../SeleccionarDestino.vue/index.js'
import ObjetivoTextarea from '../../ObjetivoTextarea.vue/index.js'
import AdjuntosParent from '../inputs/ItemAdjuntosParent.vue'
import AdjuntosWidget from '../../AdjuntosWidget.vue/index.js'
import TipoWidget from '../../TipoWidget.vue/index.js'
import CumplirWidget from '../../CumplirWidget.vue/index.js'
import { ref, computed, watch } from 'vue'

const item = useItemStore()
const sending = ref(false)
const result = ref({ errors: {} })
const dialog = ref(true)
const form = ref({
  padre: null,
  destino: null,
  objetivo: null,
  adjuntos: null,
  tipo: null,
  cumplir_en: null
})
const adjuntos = ref(null) // DOM
const adjuntosParent = ref(null) // DOM
const data = computed(() => item.data)
watch(data, d => {
  form.value = {
    padre: d.id,
    objetivo: d.objetivo,
    adjuntos: [],
    tipo: d.tipo?.id,
    cumplir_en: d.cumplir_en?.slice(0, 10)
  }
}, { immediate: true })
function validate() {
  const errors = {}
  if (!form.value.destino) errors.destino = 'Seleccione un área válida'
  if (!form.value.objetivo) errors.objetivo = 'Este campo no puede estar vacío'
  result.value = { errors }
  return !Object.keys(errors).length
}
function submit() {
  if (!validate()) return
  sending.value = true
  form.value.adjuntos = adjuntos.value.ids().concat(adjuntosParent.value.ids())
  // item.post(form.value).then(res => process.POST(res.data, accepted, errors))
}
function accepted() {
  dialog.value = false
  // handlePost({ action: 'forward' })
}
const errors = () => sending.value = false
</script>

<template>
  <bs-dialog v-model="dialog" @hidden="$emit('close')" lg fullSmDown>
    <bs-dialog-header label="Nueva solicitud [Reenviada]" border />
    <bs-dialog-body>
      <form @submit.prevent>
        <DestinoSelect v-model:error="result.errors.destino" v-model:value="form.destino" />
        <ObjetivoTextarea v-model:error="result.errors.objetivo" v-model:value="form.objetivo" />
        <AdjuntosParent ref="adjuntosParent" v-model:parent="data.adjuntos_solicitud" class="mb-1" />
        <AdjuntosWidget ref="adjuntos" />
      </form>
    </bs-dialog-body>
    <bs-dialog-footer start>
      <bs-btn-send :active="sending" @click="submit" />
      <bs-btn-icon flat @click="$refs.adjuntos.select()" icon="paperclip" style="font-size:20px">
        <bs-tooltip placement="top" offset="0,10">Adjuntar documento</bs-tooltip>
      </bs-btn-icon>
      <TipoWidget v-model:error="result.errors.tipo" v-model:value="form.tipo" />
      <CumplirWidget v-model:error="result.errors.cumplir_en" v-model:value="form.cumplir_en" />
    </bs-dialog-footer>
  </bs-dialog>
</template>