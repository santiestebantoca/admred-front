<script lang="ts" setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary'
  },
  loading: Boolean
})

import { BButton } from 'bootstrap-vue-next'
import { computed } from 'vue'

const baseVariant = computed(() => props.variant.split('-').at(-1))
const isFlat = computed(() => props.variant?.startsWith('flat-'))
const isFlatOutline = computed(() => props.variant?.startsWith('flat-outline-'))
const internalVariant = computed(() => (isFlat.value ? `outline-${baseVariant.value}` : props.variant) as any)
const flatModifierClass = computed(() => {
  if (isFlatOutline.value) return 'btn-flat-outline'
  else if (isFlat.value) return 'btn-flat'
  else return ''
})
const variantMap = {
  primary: 'var(--bs-primary-rgb)',
  secondary: 'var(--bs-secondary-rgb)',
  success: 'var(--bs-success-rgb)',
  danger: 'var(--bs-danger-rgb)',
  warning: 'var(--bs-warning-rgb)',
  info: 'var(--bs-info-rgb)',
  light: 'var(--bs-light-rgb)',
  dark: 'var(--bs-dark-rgb)'
}
const rgbValue = computed(() => variantMap[baseVariant.value])
const rootStyle = computed(() => ({
  '--flat-hover': `rgba(${rgbValue.value}, 0.08)`,
  '--flat-active': `rgba(${rgbValue.value}, 0.15)`,
  '--flat-outline-border': `rgba(${rgbValue.value}, 0.25)`
}))
</script>

<template>
  <BButton :variant="internalVariant" :class="flatModifierClass" :style="rootStyle" v-bind="$attrs" :loading="loading"
    :disabled="loading">
    <slot />
  </BButton>
</template>

<style scoped>
.btn-flat,
.btn-flat-outline {
  box-shadow: none !important;
}

.btn-flat {
  border-color: transparent !important;
}

.btn-flat-outline {
  border-color: var(--flat-outline-border) !important;
}

/* Estado Hover */
.btn-flat:hover,
.btn-flat-outline:hover {
  --bs-btn-hover-color: var(--bs-btn-color);
  background-color: var(--flat-hover) !important;
}

/* Estado Active/Pressed */
.btn-flat:active,
.btn-flat.active,
.btn-flat-outline:active,
.btn-flat-outline.active {
  --bs-btn-active-color: var(--bs-btn-color);
  background-color: var(--flat-active) !important;
}

/* Estado Focus (accesibilidad) */
.btn-flat:focus-visible,
.btn-flat-outline:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

:deep(>svg) {
  position: relative;
  top: -2px;
}
</style>
