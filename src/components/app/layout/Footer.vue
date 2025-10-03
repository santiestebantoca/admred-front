<script setup>
import { useResizeObserver } from '@vueuse/core'
import { inject, ref, onUnmounted } from 'vue'

const view = inject('layout:view')
const left = inject('layout:left')
const right = inject('layout:right')
const footer = inject('layout:footer')
const el = ref(null)
useResizeObserver(el, entries => {
  //   const entry = entries[0]
  //   const { height } = entry.contentRect
  footer.value.height = el._value.offsetHeight
})
onUnmounted(() => footer.value.height = 0)
</script>

<template>
  <footer ref="el">
    <slot />
  </footer>
</template>

<style scoped>
footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1030;
}
</style>
