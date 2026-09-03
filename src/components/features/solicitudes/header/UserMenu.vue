<script setup>
import useAuthUserMenu from '@/composables/useAuthUserMenu'
import { ref } from 'vue'

const { authUser, isImpersonating, actions } = useAuthUserMenu()
const tippy = ref({
  content: `<div class="fw-bold text-start">Cuenta</div><div class="text-truncate text-start text-light">${authUser.value.name}</div>`,
  allowHTML: true,
})
</script>

<template>
  <BDropdown v-if="authUser" variant="navbar" no-caret strategy="fixed" v-tippy="tippy">
    <template #button-content>
      <img src="@/assets/images/user.png" width="22" class="center" />
    </template>
    <div class="min-w-340 px-3 py-2 d-flex flex-column gap-3">
      <p v-if="isImpersonating" class="text-center text-danger fw-bold">
        Personificado
      </p>
      <p>
        <span class="h5 d-block fw-semibold">{{ authUser.name }}</span>
        <span class="text-muted">{{ authUser.username }}</span>
        <span class="d-block mt-3">@ {{ authUser.area_nombre }}</span>
      </p>
      <div class="d-flex gap-3">
        <BButton v-for="action in actions" :key="action.title" :to="action.path" variant="primary">
          <UIcon :name="action.icon" class="me" />
          {{ action.title }}
        </BButton>
      </div>
    </div>
  </Bdropdown>
</template>