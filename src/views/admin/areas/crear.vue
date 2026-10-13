<script setup lang="ts">
const props = defineProps({
  back: Function
})

import { isValidationError } from '@/api/client'
import { useNivelesQuery } from '@/stores/niveles'
import { useAreasDelNivelQuery } from '@/stores/areas'
import { useAreaCreate } from '@/stores/areas'
import type { AreaCreate } from '@/types/models.js'
import { useToast } from 'bootstrap-vue-next'
import { ref, computed, watch } from 'vue'

const toast = useToast()
const form = ref<AreaCreate>({
  nombre: null,
  nivel: null,
  padre: null // se reinicia cuando cambia 'nivel'
})
const errors = ref<Record<string, any>>({})
const errorState = computed(() => ({
  nombre: {
    state: errors.value.nombre ? false : null,
    invalidFeedback: errors.value.nombre
  },
  nivel: {
    state: errors.value.nivel ? false : null,
    invalidFeedback: errors.value.nivel
  },
  padre: {
    state: errors.value.padre ? false : null,
    invalidFeedback: errors.value.padre
  },
}))
const { mutateAsync: crearArea, asyncStatus } = useAreaCreate()
const loading = computed(() => asyncStatus.value === 'loading')
const { niveles } = useNivelesQuery()
const nivelPadre = computed(() => form.value.nivel
  ? niveles.value?.find((d) => d.id === form.value.nivel)?.padre_id
  : undefined)
const { areas: padres, isPending: padresPending } = useAreasDelNivelQuery(nivelPadre)

watch(() => form.value.nivel, () => form.value.padre = null)

const validate = () => {
  errors.value = {}
  if (!form.value.nombre) errors.value.nombre = 'Este campo no puede estar vacío.'
  if (!form.value.nivel) errors.value.nivel = 'Seleccione un valor.'
  if (padres.value && !form.value.padre) errors.value.padre = 'Seleccione un valor.'
  return !Object.keys(errors.value).length
}
const submit = () => {
  if (!validate()) return
  crearArea(form.value)
    .then(() => {
      toast.create({ body: 'Nueva área creada.', variant: 'success' })
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
      <h5 class="mb-1">Nueva área</h5>
    </div>
    <BForm @submit.prevent="submit" density="3">
      <BFormGroup label="Nombre" v-bind="errorState.nombre">
        <BFormInput v-model="form.nombre" trim @input="errors.nombre = null" />
      </BFormGroup>
      <BFormGroup label="Nivel" v-bind="errorState.nivel" @input="errors.nivel = null">
        <BFormSelect v-model="form.nivel" :options="niveles" text-field="nombre" value-field="id" />
      </BFormGroup>
      <BFormGroup label="Pertenece a" v-bind="errorState.padre" @input="errors.padre = null">
        <BFormSelect v-model="form.padre" :options="padres" :disabled="!padres?.length || padresPending"
          text-field="nombre" value-field="id" />
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
