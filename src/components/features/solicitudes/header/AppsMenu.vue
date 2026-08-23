<script setup>
import { useNavigationApps } from '@/composables/useNavigation';

const { options } = useNavigationApps()
</script>

<template>
  <BDropdown variant="navbar" no-caret strategy="fixed" v-tippy="'Ir a'">
    <template #button-content>
      <img src="@/assets/images/apps.svg" />
    </template>
    <BDropdownItem v-for="option in options" :to="option.to" class="allow-highlight-in-route">
      <UIcon :name="option.icon" />
      {{ option.label }}
    </BDropdownItem>
  </BDropdown>
</template>