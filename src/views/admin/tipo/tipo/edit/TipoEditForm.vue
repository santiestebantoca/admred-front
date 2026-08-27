<script setup>
const props = defineProps({ id: Number, back: Function })

import NombreInput from '../../base/inputs/TipoNombreInput.vue'
import DescripcionInput from '../../base/inputs/TipoDescripcionInput.vue'
import useStore from '@/stores/admin-tipos'
import { ref, watch } from 'vue'

const store = useStore()
const sending = ref(false)
const result = ref({ errors: {} })
const form = ref({
  nombre: null,
  descripcion: null,
})
watch(() => store.tipo.data, d => {
  form.value = {
    nombre: d.nombre,
    descripcion: d.descripcion
  }
}, { immediate: true })
const validate = () => {
  const errors = {}
  if (!form.value.nombre) errors.nombre = 'Este campo no puede estar vacío'
  result.value = { errors }
  return !Object.keys(errors).length
}
const submit = () => {
  if (!validate()) return
  sending.value = true
  // store.tipo.put({ id: props.id, data: form.value })
  //   .then(res => process.PUT(res.data,
  //     () => {
  //       store.tipos.get()
  //       store.tipo.get(props.id)
  //       props.back()
  //     },
  //     errors => result.value.errors = errors))
  //   .finally(() => sending.value = false)
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
      <DescripcionInput v-model:error="result.errors.descripcion" v-model:value="form.descripcion" />
      <bs-btn-save-cancel :disable="sending" @save="submit" @cancel="back" padding />
    </form>
  </div>
</template>
