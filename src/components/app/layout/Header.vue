<script setup>
import { useResizeObserver, useWindowScroll } from '@vueuse/core'
import { inject, ref, computed, onUnmounted } from 'vue'

const { y } = useWindowScroll()
const view = inject('layout:view')
const header = inject('layout:header')
const left = inject('layout:left')
const right = inject('layout:right')
const el = ref(null)
useResizeObserver(el, entries => {
  // const entry = entries[0]
  // const { height } = entry.contentRect
  header.value.height = el._value.offsetHeight
})
onUnmounted(() => header.value.height = 0)
//
// css
const left_ = computed(() => ['l', 'L'].includes(view.value[0]) ? `${left.value.width}px` : 0)
const right_ = computed(() => ['r', 'R'].includes(view.value[2]) ? `${right.value.width}px` : 0)
const fixed = computed(() => view.value.slice(0, 3).includes('H'))
const shadow = computed(() => fixed.value && y.value && !header.value.stopShadowOnScroll)
</script>

<template>
  <header ref="el" :class="{ fixed, shadow }">
    <slot />
  </header>
</template>

<style scoped>
header {
  --position: absolute;
  --background-color: unset;
  --box-shadow: unset;
  position: var(--position);
  top: 0;
  left: v-bind(left_);
  right: v-bind(right_);
  z-index: 1030;
  box-shadow: var(--box-shadow);
  background-color: var(--background-color);
}

header :deep(.navbar-brand) {
  --bs-navbar-brand-padding-y: 0.3125rem;
  --bs-navbar-brand-margin-end: 1rem;
  --bs-navbar-brand-font-size: 1.25rem;
  --bs-navbar-brand-color: rgba(var(--bs-emphasis-color-rgb), 1);
  --bs-navbar-brand-hover-color: rgba(var(--bs-emphasis-color-rgb), 1);
}

.fixed {
  --position: fixed;
  --background-color: rgba(255, 255, 255, 0.96);
}

.shadow {
  --box-shadow: 0px 1px 2px 0px rgba(60, 64, 67, 0.3), 0px 2px 6px 2px rgba(60, 64, 67, 0.15);
}
</style>
