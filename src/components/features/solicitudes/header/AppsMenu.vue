<script setup>
import { useNavigationApps } from '@/composables/useNavigation';

const { options } = useNavigationApps()
</script>

<template>
  <BDropdown variant="flat wh-34" no-caret strategy="fixed" v-tippy="'Aplicaciones'">
    <template #button-content>
      <UIcon name="bi-three-dots" class="center" />
    </template>
    <BDropdownItem v-for="option in options" :to="option.to" class="highlight-active">
      <UIcon :name="option.icon" />
      {{ option.label }}
    </BDropdownItem>
  </BDropdown>
</template>