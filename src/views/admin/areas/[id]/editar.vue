<script setup lang="ts">
const props = defineProps({
  areaId: Number,
  back: Function
})

import { isValidationError } from '@/api/client'
import { useNivelesQuery } from '@/stores/niveles'
import { useAreasDelNivelQuery } from '@/stores/areas'
import { useAreaQuery, useAreaUpdate } from '@/stores/areas'
import type { AreaUpdate } from '@/types/models.js'
import { ref, computed, watch, watchEffect } from 'vue'

const form = ref<AreaUpdate>({
  id: props.areaId,
  nombre: null,
  nivel: null,
  padre: null // se reinicia cuando cambia 'nivel'
})
const errors = ref<Record<string, any>>({})
const errorState = computed(() => ({
  nombre: {
    state: errors.value.nombre ? false : null,
    invalidFeedback: errors.value.nombre,
    onInput: () => errors.value.nombre = null
  },
  nivel: {
    state: errors.value.nivel ? false : null,
    invalidFeedback: errors.value.nivel,
    onInput: () => errors.value.nivel = null
  },
  padre: {
    state: errors.value.padre ? false : null,
    invalidFeedback: errors.value.padre,
    onInput: () => errors.value.padre = null
  },
}))
const { area, isPending } = useAreaQuery(props.areaId)
const { mutateAsync: actualizarArea, asyncStatus } = useAreaUpdate()
const loading = computed(() => asyncStatus.value === 'loading')
const { niveles } = useNivelesQuery()
const nivelPadre = computed(() => form.value.nivel
  ? niveles.value?.find((d) => d.id === form.value.nivel)?.padre_id
  : undefined)
const { areas: padres, isPending: padresPending } = useAreasDelNivelQuery(nivelPadre)

watchEffect(() => {
  if (area.value) {
    form.value.nombre = area.value.nombre
    form.value.nivel = area.value.nivel.id
    form.value.padre = area.value.padre.id
  }
})
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
  actualizarArea(form.value)
    .then(() => { props.back() })
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al actualizar el area.'
    })
}
</script>

<template>
  <div class="max-w-500">
    <div class="hstack gap-2 mb-4">
      <BButton @click="back" variant="flat wh-34 ms-n2">
        <ILucideArrowLeft class="center" />
      </BButton>
      <h5 class="mb-1">Editar área</h5>
    </div>
    <BForm @submit.prevent="submit" density="3">
      <BFormGroup label="Nombre" v-bind="errorState.nombre">
        <BFormInput v-model="form.nombre" trim />
      </BFormGroup>
      <BFormGroup label="Nivel" v-bind="errorState.nivel">
        <BFormSelect v-model="form.nivel" :options="niveles" text-field="nombre" value-field="id" />
      </BFormGroup>
      <BFormGroup label="Pertenece a" v-bind="errorState.padre">
        <BFormSelect v-model="form.padre" :options="padres" :disabled="!padres?.length || padresPending"
          text-field="nombre" value-field="id" />
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