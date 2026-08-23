<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const navigation = ref((performance.getEntriesByType('navigation') as PerformanceNavigationTiming[])
  .some(d => d.type === 'navigate'))
onMounted(() => setTimeout(() => navigation.value = false, 3000))
</script>

<template>
  <div v-if="navigation" class="vh-100 d-flex align-items-center justify-content-center">
    <h4 class="text-primary-emphasis fw-semibold animate">SMS</h4>
  </div>
  <slot v-else></slot>
</template>

<style scoped>
@keyframes growAndFade {
  0% {
    transform: scale(0.8);
    opacity: 0.3;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate {
  animation: growAndFade 1s ease-out forwards;
}
</style>