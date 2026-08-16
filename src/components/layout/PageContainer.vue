<script lang="ts" setup>
import { computed, inject, ref } from 'vue'

const view = inject<import('vue').ComputedRef<string>>('layout:view', computed(() => ''))
const header = inject<import('vue').Ref<{ height: number; left: number; right: number; stopShadowOnScroll: boolean }>>('layout:header', ref({ height: 0, left: 0, right: 0, stopShadowOnScroll: true }))
const footer = inject<import('vue').Ref<{ height: number; left: number; right: number }>>('layout:footer', ref({ height: 0, left: 0, right: 0 }))
const left = inject<import('vue').Ref<{ width: number; top: number; bottom: number }>>('layout:left', ref({ width: 0, top: 0, bottom: 0 }))
const right = inject<import('vue').Ref<{ width: number; top: number; bottom: number }>>('layout:right', ref({ width: 0, top: 0, bottom: 0 }))
//
// css
const paddingLeft = computed(() => `${left.value.width}px`)
const paddingTop = computed(() => `${header.value.height}px`)
const paddingBottom = computed(() => `${footer.value.height}px`)
</script>

<template>
  <div class="app-page-container">
    <slot />
  </div>
</template>

<style scoped>
.app-page-container {
  padding-top: v-bind(paddingTop);
  padding-bottom: v-bind(paddingBottom);
  padding-left: v-bind(paddingLeft);
}
</style>