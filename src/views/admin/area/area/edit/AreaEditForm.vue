<script setup>
const props = defineProps({ id: Number, back: Function })

import useHandleSubmit from '@/use/useHandleSubmit.js'
import NombreInput from '../../base/inputs/AreaNombreInput.vue'
import NivelSelect from '../../base/inputs/AreaNivelSelect.vue'
import PadreSelect from '../../base/inputs/AreaPadreSelect.vue'
import useStore from '@/stores/admin-areas'
import { ref, watch } from 'vue'

const process = useHandleSubmit()
const store = useStore()
const sending = ref(false)
const result = ref({ errors: {} })
const form = ref({
  nombre: null,
  nivel: null,
  padre: null // null on 'nivel' updated
})
watch(() => store.area.data, d => {
  form.value = {
    nombre: d.nombre,
    nivel: d.nivel.id,
    padre: d.padre.id,
  }
}, { immediate: true })
const padreDisabled = ref(null)
const validate = () => {
  const errors = {}
  if (!form.value.nombre) errors.nombre = 'Este campo no puede estar vacío'
  if (!form.value.nivel) errors.nivel = 'Seleccione un valor'
  if (!padreDisabled.value && !form.value.padre) errors.padre = 'Seleccione un valor'
  result.value = { errors }
  return !Object.keys(errors).length
}
const submit = () => {
  if (!validate()) return
  sending.value = true
  store.area.put({ id: props.id, data: form.value })
    .then(res => process.PUT(res.data,
      () => {
        store.areas.get()
        store.area.get(props.id)
        props.back()
      },
      errors => result.value.errors = errors))
    .finally(() => sending.value = false)
}
</script>

<template>
  <div class="data-box">
    <div class="data-header">
      <bs-btn-back @click="back" />
      <span class="fs-5">Editar registro</span>
    </div>
    <form @submit.prevent class="data-form">
      <NombreInput v-model:error="result.errors.nombre" v-model:value="form.nombre" />
      <NivelSelect v-model:error="result.errors.nivel" v-model:value="form.nivel" />
      <PadreSelect :nivel="form.nivel" v-model:error="result.errors.padre" v-model:value="form.padre"
        v-model:disabled="padreDisabled" />
      <bs-btn-save-cancel :disable="sending" @save="submit" @cancel="back" padding />
    </form>
  </div>
</template>
