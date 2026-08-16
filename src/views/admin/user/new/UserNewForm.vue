<!-- Used as part of a wizard -->
<script setup>
const id = defineModel()

import useHandleSubmit from '@/use/useHandleSubmit.js'
import FirstNameInput from '../base/inputs/UserFirstNameInput.vue'
import LastNameInput from '../base/inputs/UserLastNameInput.vue'
import UsernameInput from '../base/inputs/UserUsernameInput.vue'
import EmailInput from '../base/inputs/UserEmailInput.vue'
import MovilInput from '../base/inputs/UserMovilInput.vue'
import FijoInput from '../base/inputs/UserFijoInput.vue'
import AreaSelect from '../base/inputs/UserAreaSelect.vue'
import { useAuthQuery } from '@/stores/auth'
import useStore from '@/stores/admin-users'
import { ref, computed } from 'vue'

const process = useHandleSubmit()
const { authUser } = useAuthQuery()
const store = useStore().user
const sending = ref(false)
const form = ref({
  first_name: null,
  last_name: null,
  username: null,
  email: null,
  movil: null,
  fijo: null,
  area: null
})
const result = ref({ errors: {} })
const areaSelectable = computed(() => authUser.value?.AR)
const validate = () => {
  const errors = {}
  if (!form.value.first_name) errors.first_name = 'Este campo no puede estar vacío'
  if (!form.value.last_name) errors.last_name = 'Este campo no puede estar vacío'
  if (!form.value.username) errors.username = 'Este campo no puede estar vacío'
  if (!form.value.email) errors.email = 'Este campo no puede estar vacío'
  if (areaSelectable.value && !form.value.area) errors.area = 'Seleccione un valor'
  result.value = { errors }
  return !Object.keys(errors).length
}
const submit = () => {
  if (!validate()) return
  sending.value = true
  store.post(form.value)
    .then(res => process.POST(res.data,
      id_ => id.value = id_,
      errors => result.value.errors = errors))
    .finally(() => sending.value = false)
}
</script>

<template>
  <form @submit.prevent class="data-form">
    <FirstNameInput v-model:error="result.errors.first_name" v-model:value="form.first_name" />
    <LastNameInput v-model:error="result.errors.last_name" v-model:value="form.last_name" />
    <UsernameInput v-model:error="result.errors.username" v-model:value="form.username" />
    <EmailInput v-model:error="result.errors.email" v-model:value="form.email" />
    <MovilInput v-model:error="result.errors.movil" v-model:value="form.movil" />
    <FijoInput v-model:error="result.errors.fijo" v-model:value="form.fijo" />
    <AreaSelect v-if="areaSelectable" v-model:error="result.errors.area" v-model:value="form.area" />
    <bs-btn :disabled="sending" class="mt-3" @click="submit" color="primary">
      Siguiente <i class="bi-chevron-right" style="position: relative;left: 4px" />
    </bs-btn>
  </form>
</template>
