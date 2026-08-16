<script lang="ts" setup>
import { useResizeObserver } from '@vueuse/core'
import { inject, ref, onUnmounted, computed } from 'vue'

const view = inject<import('vue').ComputedRef<string>>('layout:view', computed(() => ''))
const left = inject<import('vue').Ref<{ width: number; top: number; bottom: number }>>('layout:left', ref({ width: 0, top: 0, bottom: 0 }))
const right = inject<import('vue').Ref<{ width: number; top: number; bottom: number }>>('layout:right', ref({ width: 0, top: 0, bottom: 0 }))
const footer = inject<import('vue').Ref<{ height: number; left: number; right: number }>>('layout:footer', ref({ height: 0, left: 0, right: 0 }))
const el = ref<HTMLElement | null>(null)
useResizeObserver(el, entries => {
  //   const entry = entries[0]
  //   const { height } = entry.contentRect
  footer.value.height = el.value?.offsetHeight ?? 0
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
