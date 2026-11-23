<script setup lang="ts">
const props = defineProps({
  back: Function,
  nivelInicial: Number,
  padreInicial: Number,
})

import type { ErroresDeValidacion } from '@/types/api'
import { isValidationError } from '@/api/client'
import BotonEnvio from '@/components/commons/BotonEnvio.vue'
import IndicadorCarga from '@/components/commons/IndicadorCarga.vue'
import { useNivelesQuery } from '@/stores/niveles'
import { useAreasPadresQuery, useAreaCreate, useAreasQuery, nivelesPadreDe } from '@/stores/areas'
import { useAuthQuery } from '@/stores/auth'
import type { AreaCreate } from '@/types/models.js'
import { useNotificaciones } from '@/composables/useNotificaciones'
import { ref, computed, watch, watchEffect } from 'vue'

const { exito } = useNotificaciones()
const { authUser } = useAuthQuery()
const esAR = computed(() => !!authUser.value?.AR)
const { areas } = useAreasQuery({})
const form = ref<AreaCreate>({
  nombre: null,
  nivel: props.nivelInicial ?? null,
  padre: props.padreInicial ?? null // se reinicia cuando cambia 'nivel'
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
const nivelesPadre = computed(() =>
  nivelesPadreDe(form.value.nivel, niveles.value ?? []))
const { options: padres, isPending: padresPending } = useAreasPadresQuery(nivelesPadre)

// El no AR crea siempre bajo un área de su ámbito: la de contexto o la propia.
watchEffect(() => {
  if (!esAR.value && !form.value.padre) {
    form.value.padre = props.padreInicial ?? authUser.value?.area ?? null
  }
})

const padreNombre = computed(() => {
  if (esAR.value) return undefined
  const id = form.value.padre
  if (!id) return '-'
  if (id === authUser.value?.area) return authUser.value?.area_nombre ?? '-'
  return (areas.value ?? []).find(area => area.id === id)?.nombre ?? `Área ${id}`
})

watch(() => form.value.nivel, () => form.value.padre = null)

const validate = () => {
  errors.value = {}
  if (!form.value.nombre) errors.value.nombre = 'Este campo no puede estar vacío.'
  if (esAR.value) {
    if (!form.value.nivel) errors.value.nivel = 'Seleccione un valor.'
    if (nivelesPadre.value.length && !form.value.padre) errors.value.padre = 'Seleccione un valor.'
  } else if (!form.value.padre) {
    errors.value.padre = 'No se pudo determinar el área.'
  }
  return !Object.keys(errors.value).length
}
const submit = () => {
  if (loading.value || !validate()) return
  crearArea(esAR.value ? form.value : { ...form.value, nivel: null })
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
      <BFormGroup v-if="esAR" label="Nivel" v-bind="errorState.nivel">
        <BFormSelect v-model="form.nivel" :options="niveles" />
      </BFormGroup>
      <BFormGroup v-if="esAR" label="Pertenece a" v-bind="errorState.padre">
        <BFormSelect v-model="form.padre" :options="padres" :disabled="!padres?.length || padresPending" />
        <IndicadorCarga v-if="nivelesPadre.length && padresPending" inline texto="Cargando áreas…" class="mt-1" />
      </BFormGroup>
      <BFormGroup v-else label="Pertenece a" v-bind="errorState.padre">
        <BFormInput :model-value="padreNombre ?? ''" disabled />
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
