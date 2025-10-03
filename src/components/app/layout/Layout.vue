<script setup>
const props = defineProps({
  view: { type: String, default: 'hhh lpr fff' },
})

import { useWindowSize } from "@vueuse/core"
import { provide, ref, computed, watchEffect } from 'vue'

const { height } = useWindowSize()
//
const window = ref({
  height: 0,
})
const header = ref({
  height: 0,
  left: 0,
  right: 0,
})
const left = ref({
  width: 0,
  top: 0,
  bottom: 0
})
const right = ref({
  width: 0,
  top: 0,
  bottom: 0
})
const footer = ref({
  height: 0,
  left: 0,
  right: 0,
})
const page = ref({
  minHeight: 0
})
provide('layout:window', window)
provide('layout:header', header)
provide('layout:left', left)
provide('layout:right', right)
provide('layout:footer', footer)
provide('layout:page', page)
//
const view = computed(() => props.view)
provide('layout:view', view)
//
watchEffect(() => window.value.height = height.value)
watchEffect(() => page.value.minHeight = height.value - header.value.height - footer.value.height)
// css
const minHeight = computed(() => `${height.value}px`)
</script>

<template>
  <div class="app-layout">
    <slot />
  </div>
</template>

<style>
html,
body,
#app {
  width: 100%;
}

body {
  min-width: 100px;
  min-height: 100%;
}

.app-layout {
  width: 100%;
  min-height: v-bind(minHeight);
  overflow: auto;
}
</style>