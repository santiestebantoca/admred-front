<script lang="ts" setup>
const props = defineProps({ close: Function })

import useAuthUserMenu from '@/composables/useAuthUserMenu'
import { ref } from 'vue'

const { authUser, isImpersonating, actions } = useAuthUserMenu()
const dialog = ref(null)
const handleClick = () => {
  props.close()
  dialog.value = !dialog.value
}
</script>

<template>
  <BListGroup flush class="drawer">
    <BListGroupItem class="title">
      Usuario
    </BListGroupItem>
    <BListGroupItem @click="handleClick" button>
      <UIcon name="bi-person" />
      <span class="text-truncate mx-2 fw-semibold" v-text="authUser.name" />
    </BListGroupItem>
  </BListGroup>

  <BModal v-model="dialog" title="Usuario" no-footer fullscreen="sm">
    <p v-if="isImpersonating" class="text-center text-danger fw-bold">
      Personificado
    </p>
    <p class="">
      <span class="h5 d-block fw-semibold" v-text="authUser.name" />
      <span class="text-muted" v-text="authUser.username" />
    </p>
    <p class="mb-4">@ <span v-text="authUser.area_nombre" /></p>
    <BRow>
      <BCol v-for="action in actions" cols="auto">
        <BButton :key="action.title" :to="action.path" variant="primary">
          <UIcon :name="action.icon" />
          {{ action.title }}
        </BButton>
      </BCol>
    </BRow>
  </BModal>
</template>

<style scoped>
.drawer {
  --bs-list-group-border-width: 0 !important;
  --bs-list-group-border-color: transparent !important;

  .list-group-item {
    color: var(--bs-dark);

    &.title {
      font-size: .875em;
      color: var(--bs-secondary);
      font-weight: 600;
    }

    svg {
      position: relative;
      top: -2px;
      width: 1rem;
      height: 1rem;
    }
  }
}
</style>