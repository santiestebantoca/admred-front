<script setup lang="ts">
const props = defineProps({
  tipoId: Number,
  back: Function
})

import type { ErroresDeValidacion } from '@/types/api'
import { isValidationError } from '@/api/client'
import BotonEnvio from '@/components/commons/BotonEnvio.vue'
import { useTipoUpdate } from '@/stores/tipos'
import type { TipoUpdate } from '@/types/models.js'
import { ref, computed, inject, Ref } from 'vue'

const tipo = inject<Ref>('tipo:tipo')
const form = ref<TipoUpdate>({
  id: props.tipoId,
  nombre: tipo.value.nombre,
  descripcion: tipo.value.descripcion,
})
const errors = ref<ErroresDeValidacion>({})
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
const { mutateAsync: actualizarTipo, asyncStatus } = useTipoUpdate()
const loading = computed(() => asyncStatus.value === 'loading')

const validate = () => {
  errors.value = {}
  if (!form.value.nombre) errors.value.nombre = 'Este campo no puede estar vacío.'
  return !Object.keys(errors.value).length
}
const submit = () => {
  if (loading.value || !validate()) return
  actualizarTipo(form.value)
    .then(() => { props.back() })
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al actualizar el tipo.'
    })
}
</script>

<template>
  <div class="max-w-500 px-3">
    <h5 class="mb-5">Editar tipo</h5>

    <BForm @submit.prevent="submit" density="3" :aria-busy="loading">
      <BFormGroup label="Nombre" v-bind="errorState.nombre">
        <BFormInput v-model="form.nombre" trim />
      </BFormGroup>
      <BFormGroup label="Descripción" v-bind="errorState.descripcion">
        <BFormTextarea v-model="form.descripcion" trim no-resize />
      </BFormGroup>
      <BFormButtons class="py-4">
        <BotonEnvio type="submit" variant="primary w-90" :loading="loading" loading-fill
          texto-cargando="Guardando cambios…">
          Guardar
        </BotonEnvio>
        <BButton @click="back()" variant="emphasis w-90" :disabled="loading">
          Cancelar
        </BButton>
      </BFormButtons>
    </BForm>
  </div>
</template>
