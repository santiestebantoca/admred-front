<script setup>
import useHandleSubmit from '@/use/useHandleSubmit.js'
import useWebSocketAlt from '@/use/useWebSocketAlt.js'
import useItemStore from '@/stores/item'
import { ref, watch } from 'vue'

const process = useHandleSubmit()
const { handlePost } = useWebSocketAlt()
const item = useItemStore()
const sending = ref(false)
const result = ref({ errors: {} })
const value = ref(null)
const reference = ref(0)
const dialog = ref(true)
const form = ref({
  evaluacion: null
})
watch(value, val => form.value.evaluacion = val)
function validate() {
  const errors = {}
  if (!form.value.evaluacion) errors.evaluacion = 'Seleccione una calificación de 1 a 5'
  result.value = { errors }
  return !Object.keys(errors).length
}
function submit() {
  if (!validate()) return
  sending.value = true
  item.put({ id: item.data.id, data: form.value }).then(res => process.PUT(res.data, accepted, errors))
}
function accepted() {
  dialog.value = false
  handlePost({ action: 'rate' })
}
const errors = () => sending.value = false
</script>

<template>
  <bs-dialog v-model="dialog" @hidden="$emit('close')" fullSmDown>
    <bs-dialog-header label="Nueva solicitud" />
    <bs-dialog-body>
      <p>Calificación del demandante sobre la eficacia de la respuesta emitida.</p>
      <div class="text-body-tertiary form-control mx-auto pt-1" style="width:168px">
        <span v-for="i in [1, 2, 3, 4, 5]" :key="i" @click="value = reference = i"
          :class="{ 'text-warning': value >= i }" @mouseenter="value = i" @mouseleave="value = reference">
          <i class="bi-star-fill px-1" style="font-size:20px" />
        </span>
      </div>
      <div class="small text-danger ps-1" v-text="result.errors.evaluacion" />
    </bs-dialog-body>
    <bs-dialog-footer start>
      <bs-btn-send :active="sending" @click="submit" />
    </bs-dialog-footer>
  </bs-dialog>
</template>
