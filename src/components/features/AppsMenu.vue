<script setup>
import { useNavigationApps } from '@/composables/useNavigation'

const { options } = useNavigationApps()
</script>

<template>
  <BListGroup flush class="drawer">
    <BListGroupItem class="title">
      Aplicaciones
    </BListGroupItem>
    <BListGroupItem v-for="option in options" :to="option.to" class="allow-highlight-in-route">
      <UIcon :name="option.icon" class="me-2" />
      {{ option.label }}
    </BListGroupItem>
  </BListGroup>
</template>

<style scoped lang="scss">
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

.router-link-active {
  display: none;
}
</style>