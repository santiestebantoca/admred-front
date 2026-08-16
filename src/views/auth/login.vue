<script lang="ts" setup>
const props = defineProps({ next: Function })

import { useLogin } from '@/stores/auth'
import type { LoginCredentials } from '@/types/models'
import { ref, computed, watch, watchEffect } from 'vue'
import { useToast } from 'bootstrap-vue-next'
import { transition } from '@vueuse/core'

const { create: showToast } = useToast()
const errors = ref<Record<string, any>>({})
const type = ref<'password' | 'text'>('password')
const formDefault = {
  username: null,
  password: null,
}
const form = ref<LoginCredentials>({ ...formDefault })
const alert = ref(0)
const { mutateAsync: login, state: loginState, asyncStatus } = useLogin()
const loading = computed(() => asyncStatus.value === 'loading')

watchEffect(() => alert.value = loginState.value.error ? 5000 : 0)

const validate = () => {
  errors.value = {}
  if (!form.value.username) errors.value.username = 'Valor requerido'
  if (!form.value.password) errors.value.password = 'Valor requerido'
  return !Object.keys(errors.value).length
}
const submit = () => {
  if (!validate()) return
  login(form.value).then(() => props.next())
}
const toggleType = () => type.value = type.value === 'password' ? 'text' : 'password'
</script>

<template>
  <div class="grid">
    <div class="content">
      <h5 class="text-primary-emphasis fw-semibold">Inicio de sesión</h5>
      <div class="text-muted login-hint">
        Usuario del dominio "etecsa.cu"
      </div>
      <BAlert v-model="alert" variant="danger" class="mb-3 small">
        Credenciales no válidas
      </BAlert>
      <form @submit.prevent>
        <div class="position-relative mb-3">
          <UIcon name="bi-person" class="p-icon" />
          <BFormInput v-model="form.username" name="username" placeholder="Nombre de usuario"
            @input="errors.username = null" />
          <div class="invalid-feedback d-block" v-text="errors.username" />
        </div>
        <div class="position-relative mb-3">
          <UIcon name="bi-lock" class="p-icon" />
          <BFormInput :type="type" v-model="form.password" name="password" placeholder="Contraseña"
            @input="errors.password = null" />
          <div class="invalid-feedback d-block" v-text="errors.password" />
          <BButton @click.stop="toggleType" variant="flat" class="btn-sm p-end-button">
            <UIcon :name="type === 'password' ? 'bi-eye' : 'bi-eye-slash'" />
          </BButton>
        </div>
        <div class="mt-4">
          <BButton @click="submit" variant="primary" :disabled="loading" class="w-100 lh-lg">
            {{ loading ? 'Autenticando' : 'Iniciar sesión' }}
          </BButton>
        </div>
      </form>
      <BAlert show variant="light" class="small mt-4">
        El registro de usuario siempre es realizado por un administrador
      </BAlert>
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
  max-height: 400px;
}

.login-hint {
  line-height: 21px;
  padding: 12px 2px;
}

[name] {
  padding-left: 38px;
}

.p-icon {
  position: absolute;
  top: 9px;
  left: 10px;
}

.p-end-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 4px;
}
</style>
