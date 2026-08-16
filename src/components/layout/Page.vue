<script lang="ts" setup>
import { inject, computed, ref } from 'vue'

const view = inject<import('vue').ComputedRef<string>>('layout:view', computed(() => ''))
const page = inject<import('vue').Ref<{ minHeight: number }>>('layout:page', ref({ minHeight: 0 }))
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