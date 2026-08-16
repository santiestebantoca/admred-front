<script setup>
import { computed, inject } from 'vue'

const view = inject('layout:view')
const header = inject('layout:header')
const footer = inject('layout:footer')
const left = inject('layout:left')
const right = inject('layout:right')
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