<script setup>
import TramitadorSelect from '../inputs/ItemTramitadorSelect.vue'
import TipoWidget from '../../TipoWidget.vue/index.js'
import useItemStore from '@/stores/item'
import { ref, watch } from 'vue'

const item = useItemStore()
const sending = ref(false)
const result = ref({ errors: {} })
const dialog = ref(true)
const form = ref({
  tramitador: null,
  tipo: null
})
watch(() => item.data, d => {
  form.value = {
    tramitador: d.tramitador?.id,
    tipo: d.tipo?.id
  }
}, { immediate: true })
function validate() {
  const errors = {}
  if (!form.value.tramitador) errors.tramitador = 'Seleccione un valor'
  result.value = { errors }
  return !Object.keys(errors).length
}
function submit() {
  if (!validate()) return
  sending.value = true
  // item.put({ id: item.data.id, data: form.value }).then(res => process.PUT(res.data, accepted, errors))
}
function accepted() {
  dialog.value = false
  // handlePost({ action: 'assign' })
}
const errors = () => sending.value = false
</script>

<template>
  <bs-dialog v-model="dialog" @hidden="$emit('close')" fullSmDown>
    <bs-dialog-header label="Asignar solicitud" />
    <bs-dialog-body>
      <form @submit.prevent>
        <TramitadorSelect v-model:error="result.errors.tramitador" v-model:value="form.tramitador" />
      </form>
    </bs-dialog-body>
    <bs-dialog-footer start>
      <bs-btn-send :active="sending" @click="submit" />
      <TipoWidget down v-model:error="result.errors.tipo" v-model:value="form.tipo" />
    </bs-dialog-footer>
  </bs-dialog>
</template>