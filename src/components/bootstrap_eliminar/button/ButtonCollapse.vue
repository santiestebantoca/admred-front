<script setup>
const expanded = defineModel()

import BsBtn from './ButtonIcon.vue'
</script>

<template>
  <bs-btn flat @click.stop="expanded = !expanded" :class="{ expanded }">
    <svg focusable="false" viewBox="0 0 16 16" width="16" fill="currentColor">
      <path fill-rule="evenodd"
        d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
    </svg>
  </bs-btn>
</template>

<style scoped>
.expanded>svg {
  transform: rotate(-90deg);
}
</style>