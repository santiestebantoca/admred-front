<script setup>
const props = defineProps({ id: Number, back: Function })

import useHandleSubmit from '@/use/useHandleSubmit.js'
import { useAuthQuery } from '@/stores/auth'
import useStore from '@/stores/admin-users'
import FirstNameInput from '../../base/inputs/UserFirstNameInput.vue'
import LastNameInput from '../../base/inputs/UserLastNameInput.vue'
import UsernameInput from '../../base/inputs/UserUsernameInput.vue'
import EmailInput from '../../base/inputs/UserEmailInput.vue'
import MovilInput from '../../base/inputs/UserMovilInput.vue'
import FijoInput from '../../base/inputs/UserFijoInput.vue'
import AreaSelect from '../../base/inputs/UserAreaSelect.vue'
import { ref, watch, computed } from 'vue'

const process = useHandleSubmit()
const { authUser } = useAuthQuery()
const store = useStore()
const sending = ref(false)
const result = ref({ errors: {} })
const form = ref({
  first_name: null,
  last_name: null,
  username: null,
  email: null,
  movil: null,
  fijo: null,
  area: null
})
watch(() => store.user.data, d => {
  form.value = {
    first_name: d.first_name,
    last_name: d.last_name,
    username: d.username,
    email: d.email,
    movil: d.movil,
    fijo: d.fijo,
    area: d.area.id
  }
}, { immediate: true })
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
  store.user.put({ id: props.id, data: form.value })
    .then(res => process.PUT(res.data,
      () => {
        store.users.get()
        store.user.get(props.id)
        props.back()
      },
      errors => result.value.errors = errors))
    .finally(() => sending.value = false)
}
</script>

<template>
  <div class="data-box">
    <div class="data-header">
      <bs-btn-back @click="back" />
      <span class="fs-5">Editar registro</span>
    </div>
    <form @submit.prevent class="data-form">
      <FirstNameInput v-model:error="result.errors.first_name" v-model:value="form.first_name" />
      <LastNameInput v-model:error="result.errors.last_name" v-model:value="form.last_name" />
      <UsernameInput v-model:error="result.errors.username" v-model:value="form.username" />
      <EmailInput v-model:error="result.errors.email" v-model:value="form.email" />
      <MovilInput v-model:error="result.errors.movil" v-model:value="form.movil" />
      <FijoInput v-model:error="result.errors.fijo" v-model:value="form.fijo" />
      <AreaSelect v-if="areaSelectable" v-model:error="result.errors.area" v-model:value="form.area" />
      <bs-btn-save-cancel :disable="sending" @save="submit" @cancel="back" padding />
    </form>
  </div>
</template>
