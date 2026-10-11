<script setup lang="ts">
const props = defineProps({
  back: Function
})

import { isValidationError } from '@/api/client'
import { useTipoCreate } from '@/stores/tipos'
import type { TipoCreate } from '@/types/models.js'
import { useToast } from 'bootstrap-vue-next'
import { ref, computed } from 'vue'

const toast = useToast()
const form = ref<TipoCreate>({
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
const { mutateAsync: crearTipo, asyncStatus } = useTipoCreate()
const loading = computed(() => asyncStatus.value === 'loading')

const validate = () => {
  errors.value = {}
  if (!form.value.nombre) errors.value.nombre = 'Este campo no puede estar vacío.'
  return !Object.keys(errors.value).length
}
const submit = () => {
  if (!validate()) return
  crearTipo(form.value)
    .then(() => {
      toast.create({ body: 'Nuevo tipo creado.', variant: 'success' })
      props.back()
    })
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al crear el registro.'
    })
}
</script>

<template>
  <div class="max-w-500">
    <div class="hstack gap-2 mb-4">
      <BButton @click="back" variant="flat wh-34 ms-n2">
        <ILucideArrowLeft class="center" />
      </BButton>
      <h5 class="mb-1">Nuevo tipo</h5>
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
          Crear
        </BButton>
        <BButton type="reset" variant="emphasis">
          Reiniciar
        </BButton>
      </BFormButtons>
    </BForm>
  </div>
</template>