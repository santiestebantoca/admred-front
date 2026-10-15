<script setup lang="ts">
const props = defineProps({
  back: Function
})

import { EMAIL_PATRON, TELEFONO_PATRON } from '@/constants'
import { isValidationError } from '@/api/client'
import { useAuthQuery } from '@/stores/auth'
import { useAreasOpcionesQuery } from '@/stores/areas'
import { useAuthGroupsQuery } from '@/stores/auth-groups'
import { useUsuarioCreate } from '@/stores/usuarios'
import type { UsuarioCreate } from '@/types/models.js'
import { useToast } from 'bootstrap-vue-next'
import { ref, computed, watchEffect } from 'vue'

const toast = useToast()
const { authUser } = useAuthQuery()
const form = ref<UsuarioCreate>({
  first_name: null,
  last_name: null,
  username: null,
  email: null, // se actualiza con username, no aparece en la IU
  area: null,
  fijo: null,
  movil: null,
  grupos: [],
})
const errors = ref<Record<string, any>>({})
const errorState = computed(() => ({
  first_name: {
    state: errors.value.first_name ? false : null,
    invalidFeedback: errors.value.first_name,
    onInput: () => errors.value.first_name = null
  },
  last_name: {
    state: errors.value.last_name ? false : null,
    invalidFeedback: errors.value.last_name,
    onInput: () => errors.value.last_name = null
  },
  username: {
    state: errors.value.username ? false : null,
    invalidFeedback: errors.value.username,
    onInput: () => errors.value.username = null
  },
  email: {
    state: errors.value.email ? false : null,
    invalidFeedback: errors.value.email,
    onInput: () => errors.value.email = null
  },
  fijo: {
    state: errors.value.fijo ? false : null,
    invalidFeedback: errors.value.fijo,
    onInput: () => errors.value.fijo = null
  },
  movil: {
    state: errors.value.movil ? false : null,
    invalidFeedback: errors.value.movil,
    onInput: () => errors.value.movil = null
  },
  area: {
    state: errors.value.area ? false : null,
    invalidFeedback: errors.value.area,
    onInput: () => errors.value.area = null
  },
}))
const { mutateAsync: crearUsuario, asyncStatus } = useUsuarioCreate()
const loading = computed(() => asyncStatus.value === 'loading')
const showArea = computed(() => authUser.value?.AR)
const { groups } = useAuthGroupsQuery()
const { areas } = useAreasOpcionesQuery(showArea)

watchEffect(() => {
  if (form.value.username) form.value.email = form.value.username + '@etecsa.cu'
  else form.value.email = null
})

const validate = () => {
  errors.value = {}
  if (!form.value.first_name) errors.value.first_name = 'Este campo no puede estar vacío.'
  if (!form.value.last_name) errors.value.last_name = 'Este campo no puede estar vacío.'
  if (!form.value.username) errors.value.username = 'Este campo no puede estar vacío.'
  if (!form.value.email) errors.value.email = 'Este campo no puede estar vacío.'
  else if (!EMAIL_PATRON.test(form.value.email)) errors.value.email = 'El campo no tiene un formato valido.'
  if (form.value.movil && !TELEFONO_PATRON.test(form.value.movil)) errors.value.movil = 'El campo no tiene un formato valido.'
  if (form.value.fijo && !TELEFONO_PATRON.test(form.value.fijo)) errors.value.fijo = 'El campo no tiene un formato valido.'
  if (showArea.value && !form.value.area) errors.value.area = 'Seleccione un valor.'
  return !Object.keys(errors.value).length
}
const submit = () => {
  if (!validate()) return
  crearUsuario(form.value)
    .then(() => {
      toast.create({ body: 'Nuevo usuario creado.', variant: 'success' })
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
      <h5 class="mb-1">Nuevo usuario</h5>
    </div>
    <BForm @submit.prevent="submit" density="3">
      <BFormGroup label="Nombre" v-bind="errorState.first_name">
        <BFormInput v-model="form.first_name" trim />
      </BFormGroup>
      <BFormGroup label="Apellidos" v-bind="errorState.last_name">
        <BFormInput v-model="form.last_name" trim />
      </BFormGroup>
      <BFormGroup label="Nombre de usuario" v-bind="errorState.username">
        <BFormInput v-model="form.username" trim />
      </BFormGroup>
      <BFormGroup label="Correo" v-bind="errorState.email">
        <BFormInput v-model="form.email" trim />
      </BFormGroup>
      <BRow>
        <BCol>
          <BFormGroup label="Móvil" v-bind="errorState.movil">
            <BFormInput v-model="form.movil" trim />
          </BFormGroup>
        </BCol>
        <BCol>
          <BFormGroup label="Oficina" v-bind="errorState.fijo">
            <BFormInput v-model="form.fijo" trim />
          </BFormGroup>
        </BCol>
      </BRow>
      <BFormGroup v-if="showArea" label="Pertenece al área" v-bind="errorState.area">
        <BFormSelect v-model="form.area" :options="areas" />
      </BFormGroup>
      <BFormGroup v-slot="{ ariaDescribedby }" label="Grupos">
        <BFormCheckboxGroup v-model="form.grupos" :aria-describedby="ariaDescribedby">
          <div class="border rounded-2 p-2">
            <BFormCheckbox v-for="group in groups" :value="group.id" class="my-2">
              <div class="text-capitalize"> {{ group.role }} </div>
              <div class=" text-secondary"> {{ group.description }} </div>
            </BFormCheckbox>
          </div>
        </BFormCheckboxGroup>
      </BFormGroup>
      <BFormButtons class="py-4">
        <BButton type="submit" variant="primary w-90" :loading="loading" loading-fill>
          Crear
        </BButton>
      </BFormButtons>
    </BForm>
  </div>
</template>