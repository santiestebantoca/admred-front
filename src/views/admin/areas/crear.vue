<script setup lang="ts">
const props = defineProps({
  back: Function
})

import type { ErroresDeValidacion } from '@/types/api'
import { isValidationError } from '@/api/client'
import BotonEnvio from '@/components/commons/BotonEnvio.vue'
import IndicadorCarga from '@/components/commons/IndicadorCarga.vue'
import { useNivelesQuery } from '@/stores/niveles'
import { useAreasDelNivelQuery } from '@/stores/areas'
import { useAreaCreate } from '@/stores/areas'
import type { AreaCreate } from '@/types/models.js'
import { useNotificaciones } from '@/composables/useNotificaciones'
import { ref, computed, watch } from 'vue'

const { exito } = useNotificaciones()
const form = ref<AreaCreate>({
  nombre: null,
  nivel: null,
  padre: null // se reinicia cuando cambia 'nivel'
})
const errors = ref<ErroresDeValidacion>({})
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
const { mutateAsync: crearArea, asyncStatus } = useAreaCreate()
const loading = computed(() => asyncStatus.value === 'loading')
const { options: niveles } = useNivelesQuery()
const nivelPadre = computed(() => form.value.nivel
  ? niveles.value?.find((d) => d.id === form.value.nivel)?.padre_id
  : undefined)
const { options: padres, isPending: padresPending } = useAreasDelNivelQuery(nivelPadre)

watch(() => form.value.nivel, () => form.value.padre = null)

const validate = () => {
  errors.value = {}
  if (!form.value.nombre) errors.value.nombre = 'Este campo no puede estar vacío.'
  if (!form.value.nivel) errors.value.nivel = 'Seleccione un valor.'
  if (padres.value && !form.value.padre) errors.value.padre = 'Seleccione un valor.'
  return !Object.keys(errors.value).length
}
const submit = () => {
  if (loading.value || !validate()) return
  crearArea(form.value)
    .then(() => {
      exito('Nueva área creada.')
      props.back()
    })
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al crear el registro.'
    })
}
</script>

<template>
  <div class="max-w-500 px-3">
    <h5 class="mb-5">Nueva área</h5>

    <BForm @submit.prevent="submit" density="3" :aria-busy="loading">
      <BFormGroup label="Nombre" v-bind="errorState.nombre">
        <BFormInput v-model="form.nombre" trim />
      </BFormGroup>
      <BFormGroup label="Nivel" v-bind="errorState.nivel">
        <BFormSelect v-model="form.nivel" :options="niveles" />
      </BFormGroup>
      <BFormGroup label="Pertenece a" v-bind="errorState.padre">
        <BFormSelect v-model="form.padre" :options="padres" :disabled="!padres?.length || padresPending" />
        <IndicadorCarga v-if="nivelPadre && padresPending" inline texto="Cargando áreas…" class="mt-1" />
      </BFormGroup>
      <BFormButtons class="py-4">
        <BotonEnvio type="submit" variant="primary w-90" :loading="loading" loading-fill
          texto-cargando="Creando área…">
          Crear
        </BotonEnvio>
        <BButton variant="emphasis w-90" :disabled="loading" @click="back()">
          Cancelar
        </BButton>
      </BFormButtons>
    </BForm>
  </div>
</template>