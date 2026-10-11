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
    invalidFeedback: errors.value.nombre
  },
  descripcion: {
    state: errors.value.descripcion ? false : null,
    invalidFeedback: errors.value.descripcion
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
    <div class="hstack gap-2 mb-4 h-38">
      <BButton @click="back" variant="flat wh-34 ms-n2">
        <ILucideArrowLeft class="center" />
      </BButton>
      <h5 class="mb-1">Editar tipo</h5>
    </div>
    <BForm @submit.prevent="submit" density="3">
      <BFormGroup label="Nombre" v-bind="errorState.nombre">
        <BFormInput v-model="form.nombre" trim @input="errors.nombre = null" />
      </BFormGroup>
      <BFormGroup label="Descripción" v-bind="errorState.descripcion">
        <BFormTextarea v-model="form.descripcion" trim @input="errors.descripcion = null" no-resize />
      </BFormGroup>
      <BFormButtons class="py-4">
        <BButton type="submit" variant="primary w-90" :loading="loading" loading-fill>
          Guardar
        </BButton>
        <BButton @click="back" variant="emphasis">
          Descartar cambios
        </BButton>
      </BFormButtons>
    </BForm>
  </div>
</template>
