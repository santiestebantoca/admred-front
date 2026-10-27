<script setup lang="ts">
const props = defineProps({
  usuarioId: Number,
  back: Function
})

import { EMAIL_PATRON, TELEFONO_PATRON, REGISTRATION_KEY_OPTIONS } from '@/constants'
import { isValidationError } from '@/api/client'
import { useAuthQuery } from '@/stores/auth'
import { useAreasOpcionesQuery } from '@/stores/areas'
import { useAuthGroupsQuery } from '@/stores/auth-groups'
import { useUsuarioQuery, useUsuarioUpdate } from '@/stores/usuarios'
import type { UsuarioUpdate } from '@/types/models.js'
import { ref, computed, watchEffect } from 'vue'

const { authUser } = useAuthQuery()
const form = ref<UsuarioUpdate>({
  id: props.usuarioId,
  first_name: null,
  last_name: null,
  username: null, // si no tiene actividad auditable (coincide con permiso de eliminar)
  email: null, // se actualiza con username, no aparece en la IU
  area: null,
  fijo: null,
  movil: null,
  grupos: [],
  registration_key: null
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
  registration_key: {
    state: errors.value.registration_key ? false : null,
    invalidFeedback: errors.value.registration_key,
    onInput: () => errors.value.registration_key = null
  },
}))
const { usuario, isPending } = useUsuarioQuery(props.usuarioId)
const { mutateAsync: actualizarUsuario, asyncStatus } = useUsuarioUpdate()
const loading = computed(() => asyncStatus.value === 'loading')
const showUsername = computed(() => usuario.value?.permisos.eliminar)
const showArea = computed(() => authUser.value?.AR)
const { groups } = useAuthGroupsQuery()
const { areas } = useAreasOpcionesQuery(showArea)

watchEffect(() => {
  if (usuario.value) {
    form.value.first_name = usuario.value.first_name
    form.value.last_name = usuario.value.last_name
    form.value.username = usuario.value.username
    form.value.email = usuario.value.email
    form.value.area = usuario.value.area.id
    form.value.fijo = usuario.value.fijo
    form.value.movil = usuario.value.movil
    form.value.grupos = usuario.value.grupos.map((d) => d.id)
    form.value.registration_key = usuario.value.registration_key
  }
})
// watchEffect(() => {
//   if (form.value.username) form.value.email = form.value.username + '@etecsa.cu'
//   else form.value.email = null
// })

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
const submit = async () => {
  if (!validate()) return
  actualizarUsuario(form.value)
    .then(() => { props.back() })
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al actualizar el usuario.'
    })
}
</script>

<template>
  <div class="max-w-500">
    <h5 class="mb-5">Editar usuario</h5>

    <BForm @submit.prevent="submit" density="3">
      <BFormGroup label="Nombre" v-bind="errorState.first_name">
        <BFormInput v-model="form.first_name" trim />
      </BFormGroup>
      <BFormGroup label="Apellidos" v-bind="errorState.last_name">
        <BFormInput v-model="form.last_name" trim />
      </BFormGroup>
      <BFormGroup v-if="showUsername" label="Nombre de usuario" description="No tiene actividad auditable realizada."
        v-bind="errorState.username">
        <BFormInput v-model="form.username" trim />
      </BFormGroup>
      <BFormGroup label="Correo" v-bind="errorState.email">
        <BFormInput v-model="form.email" trim />
      </BFormGroup>
      <BRow>
        <BCol>
          <BFormGroup label="Tel. Móvil" v-bind="errorState.movil">
            <BFormInput v-model="form.movil" trim />
          </BFormGroup>
        </BCol>
        <BCol>
          <BFormGroup label="Tel. Oficina" v-bind="errorState.fijo">
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
            <BFormCheckbox v-for="group in groups" :value="group.id" class="py-1">
              <div class="text-capitalize"> {{ group.role }} </div>
              <div class="small text-secondary"> {{ group.description }} </div>
            </BFormCheckbox>
          </div>
        </BFormCheckboxGroup>
      </BFormGroup>
      <BFormGroup label="Estado del registro">
        <BFormSelect v-model="form.registration_key" :options="REGISTRATION_KEY_OPTIONS" />
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