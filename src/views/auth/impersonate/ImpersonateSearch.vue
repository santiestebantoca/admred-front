<script setup>
import useAuthStore from '@/stores/auth'
import { computed } from 'vue'

const auth = useAuthStore()
const value = computed({
  get() { return auth.impersonate.users.filterBy?.name },
  set(val) { auth.impersonate.users.filterBy = val ? { name: val } : null }
})
const disabled = computed(() => !auth.authUser.can_impersonate)
const reset = () => value.value = null
</script>

<template>
  <div class="position-relative w-100">
    <input autofocus class="form-control" placeholder="Buscar usuario" v-model="value" v-if="!disabled" />
    <bs-btn v-if="value" icon="x-lg" @click="reset" class="position-absolute top-0 end-0" />
  </div>
</template>

<style scoped>
@media (max-width: 767.98px) {
  .form-control {
    border: none;
    box-shadow: none;
    padding-left: 4px;
  }
}
</style>