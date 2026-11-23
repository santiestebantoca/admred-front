<script setup lang="ts">
const props = defineProps({
  areaId: Number,
  back: Function
})

import type { ErroresDeValidacion } from '@/types/api'
import { isValidationError } from '@/api/client'
import BotonEnvio from '@/components/commons/BotonEnvio.vue'
import IndicadorCarga from '@/components/commons/IndicadorCarga.vue'
import { useNivelesQuery } from '@/stores/niveles'
import { useAreasPadresQuery, useAreaUpdate, nivelesPadreDe } from '@/stores/areas'
import { useAuthQuery } from '@/stores/auth'
import type { AreaUpdate } from '@/types/models.js'
import { ref, computed, watch, inject, Ref } from 'vue'

const { authUser } = useAuthQuery()
const esAR = computed(() => !!authUser.value?.AR)
const area = inject<Ref>('area:area')
const form = ref<AreaUpdate>({
  id: props.areaId,
  nombre: area.value.nombre,
  nivel: area.value.nivel.id,
  padre: area.value.padre?.id // se reinicia cuando cambia 'nivel'
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
const { mutateAsync: actualizarArea, asyncStatus } = useAreaUpdate()
const loading = computed(() => asyncStatus.value === 'loading')
const { options: niveles } = useNivelesQuery()
const nivelesPadre = computed(() =>
  nivelesPadreDe(form.value.nivel, niveles.value ?? []))
const { options: padres, isPending: padresPending } = useAreasPadresQuery(nivelesPadre)
// El área no puede ser padre de sí misma.
const padresDisponibles = computed(() =>
  padres.value?.filter(padre => padre.value !== props.areaId))

watch(() => form.value.nivel, () => form.value.padre = null)

const validate = () => {
  errors.value = {}
  if (!form.value.nombre) errors.value.nombre = 'Este campo no puede estar vacío.'
  if (esAR.value) {
    if (!form.value.nivel) errors.value.nivel = 'Seleccione un valor.'
    if (nivelesPadre.value.length && !form.value.padre) errors.value.padre = 'Seleccione un valor.'
  }
  return !Object.keys(errors.value).length
}
const submit = () => {
  if (loading.value || !validate()) return
  actualizarArea(form.value)
    .then(() => { props.back() })
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al actualizar el area.'
    })
}
</script>

<template>
  <div class="max-w-500 px-3">
    <h5 class="mb-5">Editar área</h5>

    <BForm @submit.prevent="submit" density="3" :aria-busy="loading">
      <BFormGroup label="Nombre" v-bind="errorState.nombre">
        <BFormInput v-model="form.nombre" trim />
      </BFormGroup>
      <template v-if="esAR">
        <BFormGroup label="Nivel" v-bind="errorState.nivel">
          <BFormSelect v-model="form.nivel" :options="niveles" />
        </BFormGroup>
        <BFormGroup label="Pertenece a" v-bind="errorState.padre">
          <BFormSelect v-model="form.padre" :options="padresDisponibles"
            :disabled="!padresDisponibles?.length || padresPending" />
          <IndicadorCarga v-if="nivelesPadre.length && padresPending" inline texto="Cargando áreas…" class="mt-1" />
        </BFormGroup>
      </template>
      <template v-else>
        <BFormGroup label="Nivel">
          <BFormInput :model-value="area.nivel?.nombre ?? ''" disabled />
        </BFormGroup>
        <BFormGroup label="Pertenece a">
          <BFormInput :model-value="area.padre?.nombre ?? '-'" disabled />
        </BFormGroup>
      </template>
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
