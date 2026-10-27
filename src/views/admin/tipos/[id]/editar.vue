<script setup lang="ts">
const props = defineProps({
  tipoId: Number,
  back: Function
})

import { isValidationError } from '@/api/client'
import { useTipoQuery, useTipoUpdate } from '@/stores/tipos'
import type { TipoUpdate } from '@/types/models.js'
import { ref, computed, watchEffect } from 'vue'

const form = ref<TipoUpdate>({
  id: props.tipoId,
  nombre: null,
  descripcion: null,
})
const errors = ref<Record<string, any>>({})
const errorState = computed(() => ({
  nombre: {
    state: errors.value.nombre ? false : null,
    invalidFeedback: errors.value.nombre,
    onInput: () => errors.value.nombre = null
  },
  descripcion: {
    state: errors.value.descripcion ? false : null,
    invalidFeedback: errors.value.descripcion,
    onInput: () => errors.value.descripcion = null
  },
}))
const { tipo, isPending } = useTipoQuery(props.tipoId)
const { mutateAsync: actualizarTipo, asyncStatus } = useTipoUpdate()
const loading = computed(() => asyncStatus.value === 'loading')

watchEffect(() => {
  if (tipo.value) {
    form.value.nombre = tipo.value.nombre
    form.value.descripcion = tipo.value.descripcion
  }
})

const validate = () => {
  errors.value = {}
  if (!form.value.nombre) errors.value.nombre = 'Este campo no puede estar vacío.'
  return !Object.keys(errors.value).length
}
const submit = async () => {
  if (!validate()) return
  actualizarTipo(form.value)
    .then(() => { props.back() })
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al actualizar el tipo.'
    })
}
</script>

<template>
  <div class="max-w-500">
    <h5 class="mb-5">Editar tipo</h5>

    <BForm @submit.prevent="submit" density="3">
      <BFormGroup label="Nombre" v-bind="errorState.nombre">
        <BFormInput v-model="form.nombre" trim />
      </BFormGroup>
      <BFormGroup label="Descripción" v-bind="errorState.descripcion">
        <BFormTextarea v-model="form.descripcion" trim no-resize />
      </BFormGroup>
      <BFormButtons class="py-4">
        <BButton type="submit" variant="primary w-90" :loading="loading" loading-fill>
          Guardar
        </BButton>
        <BButton @click="back" variant="emphasis w-90">
          Cancelar
        </BButton>
      </BFormButtons>
    </BForm>
  </div>
</template>
