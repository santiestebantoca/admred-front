<script lang="ts" setup>
import { ref, onUnmounted } from 'vue'

const progress = ref(0)
const interval = ref(null)
interval.value = setInterval(() => (progress.value < 99) && progress.value++, 10)
onUnmounted(() => clearInterval(interval.value))
</script>

<template>
  <div class="position-fixed top-0 start-0 w-100 h-100 bg-light bg-opacity-50 loading-overlay">
    <div class="progress loader" role="progressbar">
      <div class="progress-bar" :style="{ width: `${progress}%` }" />
    </div>
  </div>
</template>

<style scoped>
.loading-overlay {
  z-index: 1055;
}

.loading-overlay .loader {
  height: 2px;
}
</style>
