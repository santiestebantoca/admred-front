<script setup>
import { useNavigationApps } from '@/composables/useNavigation'

const { options } = useNavigationApps()
</script>

<template>
  <BListGroup class="drawer">
    <BListGroupItem class="title">
      Aplicaciones
    </BListGroupItem>
    <BListGroupItem v-for="option in options" :to="option.to">
      <UIcon :name="option.icon" />
      {{ option.label }}
    </BListGroupItem>
  </BListGroup>
</template>

<style scoped>
:deep(.router-link-active) {
  display: none;
}
</style>