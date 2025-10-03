<script setup>
const down = defineModel({ type: Boolean, default: true })
</script>

<template>
  <span class="dropdown-toggle" :class="{ down }" />
</template>

<style scoped>
.dropdown-toggle::after {
  transition: transform .2s;
}

.dropdown-toggle:not(.down)::after {
  transform: rotate(-90deg);
}
</style>
