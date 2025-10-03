<script setup>
const props = defineProps({
  icon: String,
  size: { type: String, default: '38px' },
  round: { type: Boolean, default: true }, // makes a circle shaped button (for icon)
  square: Boolean
})

import BsBtn from './Button.vue'
import { computed } from 'vue'

const attrs = computed(() => ({
  size: props.size,
  ...props.square ? { square: true } : {},
  ...!props.square && props.round ? { round: true } : {}
}))
</script>

<template>
  <bs-btn class="btn-icon" v-bind="attrs">
    <i v-if="icon" :class="'bi bi-' + icon" />
    <slot />
  </bs-btn>
</template>

<style scoped>
.btn-icon {
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

i {
  display: flex;
}
</style>