<script setup>
const props = defineProps({
  sm: Boolean,
  color: String, // primary secondary ...
  grow: Boolean,
  backdrop: Boolean
})

import { computed } from 'vue'

const cls = computed(() => {
  const cls = []
  cls.push(props.grow ? 'spinner-grow' : 'spinner-border')
  if (props.sm) cls.push(cls[0] + '-sm')
  if (props.color) cls.push('text-' + props.color)
  return cls
})
const vBackdrop = el => {
  if (props.backdrop) el.classList.add('backdrop')
}
</script>

<template>
  <div v-backdrop>
    <div :class="cls" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<style scoped>
.backdrop {
  position: relative;
  padding: 38px 76px;
  background-color: rgba(var(--bs-secondary-rgb), .3);
  border-radius: 8px;
}
</style>
