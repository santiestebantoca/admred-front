<script setup>
import { inject, computed } from 'vue'

const view = inject('layout:view')
const page = inject('layout:page')
const pageView = computed(() => view.value.split(' ')[1])
//
// css
const minHeight = computed(() => `${page.value.minHeight}px`)
const height = computed(() => pageView.value.includes('P') ? minHeight.value : 'unset')
</script>

<template>
  <main class="app-page">
    <slot />
  </main>
</template>

<style scoped>
.app-page {
  min-height: v-bind(minHeight);
  height: v-bind(height);
}
</style>