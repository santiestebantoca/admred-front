<script setup>
const props = defineProps({ next: Function })

import useSnackbarStore from '@/stores/snackbar'
import useAuthStore from '@/stores/auth'
import { ref, computed } from 'vue'

const snackbar = useSnackbarStore()
const auth = useAuthStore()
const sending = ref(false)
const errors = ref({})
const type = ref('password')
const formDefault = {
  username: null,
  password: null,
}
const form = ref({ ...formDefault })
const icon = computed(() => type.value === 'password' ? 'eye' : 'eye-slash')
const label = computed(() => sending.value ? 'Autenticando' : 'Iniciar sesión')
const validate = () => {
  errors.value = {}
  if (!form.value.username) errors.value.username = 'Valor requerido'
  if (!form.value.password) errors.value.password = 'Valor requerido'
  return !Object.keys(errors.value).length
}
const submit = () => {
  if (!validate()) return
  sending.value = true
  auth.login(form.value).then(process).finally(() => sending.value = false)
}
const process = (res) => {
  if (res.user) props.next()
  else snackbar.add(res.error)
}
const toggleType = () => type.value = type.value === 'password' ? 'text' : 'password'
</script>

<template>
  <div class="grid">
    <div class="content">
      <h5 class="text-primary-emphasis fw-semibold">Inicio de sesión</h5>
      <h6 class="text-muted">Credenciales del dominio "etecsa.cu"</h6>
      <form @submit.prevent>
        <div class="position-relative mb-3">
          <img src="@/assets/images/person.svg" alt="" class="p-icon" />
          <input type="text" class="form-control" name="username" placeholder="Nombre de usuario"
            v-model="form.username" @input="errors.username = null" />
          <div class="invalid-feedback d-block" v-text="errors.username" />
        </div>
        <div class="position-relative mb-3">
          <img src="@/assets/images/lock.svg" alt="" class="p-icon" />
          <input :type="type" class="form-control" name="password" placeholder="Contraseña" v-model="form.password"
            @input="errors.password = null">
          <div class="invalid-feedback d-block" v-text="errors.password" />
          <div class="position-absolute top-0 end-0" @click.stop="toggleType">
            <bs-icon :name="icon" fs="1.1rem" style="margin:10px" />
          </div>
        </div>
        <div class="mt-4">
          <bs-btn @click="submit" :label="label" color="primary" :disabled="sending" class="w-100 lh-lg" />
        </div>
      </form>
      <div class="alert bg-light bg-gradient small mt-4 d-flex gap-3">
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" fill="currentColor">
            <path
              d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </svg>
        </span>
        El registro de usuario siempre es realizado por un administrador
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  max-width: 320px;
  margin: 0 auto;
  min-height: inherit;
  display: grid;
  align-items: center;
  grid-template-rows: 1fr 72px;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  max-height: 380px;
}

[name] {
  padding-left: 38px;
}

.p-icon {
  position: absolute;
  top: 9px;
  left: 10px;
}
</style>
