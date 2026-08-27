<script setup>
import AprobadoRadioSet from '../inputs/ItemAprobadoRadioSet.vue'
import DesaprobadoTextarea from '../inputs/ItemDesaprobadoTextarea.vue'
import useItemStore from '@/stores/item'
import { ref, computed } from 'vue'

const item = useItemStore()
const sending = ref(false)
const result = ref({ errors: {} })
const dialog = ref(true)
const form = ref({
  aprobado: null,
  nota: null,
})
const requiresNota = computed(() => form.value.aprobado === '0')
function validate() {
  const errors = {}
  if (!form.value.aprobado) errors.aprobado = 'Escoja una opción'
  if (requiresNota.value && !form.value.nota) errors.nota = 'Este campo no puede estar vacío'
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
  // handlePost({ action: 'approve' })
}
const errors = () => sending.value = false
</script>

<template>
  <bs-dialog v-model="dialog" @hidden="$emit('close')" lg fullSmDown>
    <bs-dialog-header label="Aprobar respuesta" />
    <bs-dialog-body>
      <p>Aprobar o desaprobar la respuesta del tramitador.</p>
      <form @submit.prevent>
        <AprobadoRadioSet v-model:error="result.errors.aprobado" v-model:value="form.aprobado" />
        <DesaprobadoTextarea v-if="requiresNota" v-model:error="result.errors.nota" v-model:value="form.nota" />
      </form>
    </bs-dialog-body>
    <bs-dialog-footer start>
      <bs-btn-send :active="sending" @click="submit" />
    </bs-dialog-footer>
  </bs-dialog>
</template>