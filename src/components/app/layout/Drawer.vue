<script setup>
const show = defineModel()
const props = defineProps({
  showIfAbove: { type: Boolean },
  elevated: { type: Boolean },
  width: { type: String, default: '200' },
  breakpoint: { type: String, default: 'md' },
  side: { type: String, default: 'left' }
})

import { breakpointsBootstrapV5, useBreakpoints } from "@vueuse/core";
import { inject, computed, watch, onUnmounted } from 'vue'

const view = inject('layout:view')
const header = inject('layout:header')
const footer = inject('layout:footer')
const left = inject('layout:left')
const right = inject('layout:right')
//
const breakpoints = useBreakpoints(breakpointsBootstrapV5)
const above = breakpoints.greaterOrEqual(props.breakpoint)
watch(above, val => {
  if (val) left.value.width = props.width
  else left.value.width = 0
  show.value = false
}, { immediate: true })
watch(show, val => {
  if (above.value) show.value = false
  else {
  }
}, { immediate: true })
onUnmounted(() => left.value.width = 0)
//
// css
const width = computed(() => `${props.width}px`)
const top = computed(() => {
  if (props.side === 'left') return ['l', 'L'].includes(view.value[0]) ? 0 : `${header.value.height}px`
  if (props.side === 'right') return ['r', 'R'].includes(view.value[2]) ? 0 : `${header.value.height}px`
})
const bottom = computed(() => {
  if (props.side === 'left') return ['l', 'L'].includes(view.value[8]) ? 0 : `${footer.value.height}px`
  if (props.side === 'right') return ['r', 'R'].includes(view.value[9]) ? 0 : `${footer.value.height}px`
})
</script>

<template>
  <Transition name="drawer">
    <div class="app-drawer" tabindex="-1" v-bind="$attrs" v-if="show || above" :class="{ above }">
      <slot v-bind="{ up: above, down: !above }" />
    </div>
  </Transition>
  <div v-if="show" class="offcanvas-backdrop opacity-50" @click="show = false" />
</template>

<style scoped>
.app-drawer {
  --zindex-offcanvas-backdrop: 1040;
  --zindex-offcanvas: 1045;
  position: fixed;
  width: v-bind(width);
  top: 0;
  bottom: 0;
  z-index: var(--zindex-offcanvas);
}

.app-drawer.above {
  --zindex-offcanvas: unset;
  top: v-bind(top);
  bottom: v-bind(bottom);
  transition: none;
}

.drawer-enter-active {
  transition: transform 0.3s ease;
}

.drawer-enter-from {
  transform: translateX(-100%);
}

.drawer-leave-active {
  transition: transform 0.3s ease;
}

.drawer-leave-to {
  transform: translateX(-100%);
}
</style>