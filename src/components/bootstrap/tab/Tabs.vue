<script setup>
const model = defineModel()
const props = defineProps({ vertical: Boolean, bs: Boolean })

import { provide } from 'vue'

provide('tabs:model', model)
</script>

<template>
  <ul class="nav nav-tabs" :class="{ 'flex-column': vertical, bs }">
    <slot />
  </ul>
</template>

<style scoped>
.nav-tabs {
  --after-bottom: 0;
  --after-left: 0;
  --after-height: 2px;
  --after-width: 100%;
}

.nav-tabs.flex-column {
  --after-bottom: 0;
  --after-left: 0;
  --after-height: 100%;
  --after-width: 2px;
  border-bottom: none !important;
}

.nav-tabs:not(.bs) :deep(.nav-link) {
  border-color: transparent !important;
  margin-bottom: 0 !important;
  padding-top: 5px;
  position: relative;
}

.nav-tabs:not(.bs) :deep(.nav-link.active) {
  /* .nav-tabs :deep(.nav-link.router-link-active) { */
  color: var(--bs-nav-link-hover-color);
}

.nav-tabs:not(.bs) :deep(.nav-link::after) {
  display: block;
  content: '';
  position: absolute;
  bottom: var(--after-bottom);
  left: var(--after-left);
  height: var(--after-height);
  width: var(--after-width);
  --background-color: transparent;
  background-color: var(--background-color);
  transition: all .3s;
}

.nav-tabs:not(.bs) :deep(.nav-link.active::after) {
  /* .nav-tabs :deep(.nav-link.router-link-active::after) { */
  --background-color: var(--bs-nav-link-hover-color) !important;
}

.nav-tabs:not(.bs) :deep(.nav-link:hover::after) {
  --background-color: var(--bs-gray-200);
}
</style>