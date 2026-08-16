<script setup>
const props = defineProps({
  name: { type: String, required: true },
  fs: { type: String, default: '1rem' }, // 1.25rem
  align: { type: String, default: '-.125em' }, // baseline top middle bottom sub text-top
})

import './bootstrap-icons-1.11.3/font/bootstrap-icons.css'
</script>

<template>
  <i :class="'bi-' + name" />
</template>

<style scoped>
i {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}

i::before {
  --font-size: v-bind(fs);
  font-size: var(--font-size);
}
</style>
