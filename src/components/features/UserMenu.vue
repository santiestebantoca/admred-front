<script lang="ts" setup>
import useAuthUserMenu from '@/composables/useAuthUserMenu'
import { useToggle } from 'bootstrap-vue-next'
import { ref } from 'vue'

const { hide: hideDrawer } = useToggle('drawer-left')
const { authUser, isImpersonating, actions } = useAuthUserMenu()
const dialog = ref(null)
const handleClick = () => {
  hideDrawer()
  dialog.value = !dialog.value
}
</script>

<template>
  <BListGroup class="drawer">
    <BListGroupItem class="title">
      Usuario
    </BListGroupItem>
    <BListGroupItem @click="handleClick" button class="text-truncate fw-semibold">
      {{ authUser.name }}
    </BListGroupItem>
  </BListGroup>

  <BModal v-model="dialog" title="Usuario" no-footer fullscreen="sm">
    <div class="d-flex flex-column gap-3">
      <p v-if="isImpersonating" class="text-center text-danger fw-bold">
        Personificado
      </p>
      <p>
        <span class="h5 d-block fw-semibold" v-text="authUser.name" />
        <span class="text-muted" v-text="authUser.username" />
      </p>
      <p class="mb-4">@ <span v-text="authUser.area_nombre" /></p>
      <br>
      <div class="d-flex flex-column gap-3">
        <BButton v-for="action in actions" :key="action.title" :to="action.path" variant="primary" class="w-100">
          <UIcon :name="action.icon" class="me" />
          {{ action.title }}
        </BButton>
      </div>
    </div>
  </BModal>
</template>