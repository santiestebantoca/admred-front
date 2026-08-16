<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const presentation = ref((performance.getEntriesByType('navigation') as PerformanceNavigationTiming[])
  .some(d => d.type === 'navigate'))
onMounted(() => setTimeout(() => presentation.value = false, 2000))
</script>

<template>
  <div v-if="presentation" class="presentation vh-100 d-flex align-items-center justify-content-center">
    <div class="title-stack position-relative mx-auto">
      <h4 class="fw-semibold title">SMS</h4>
    </div>
  </div>
  <slot v-else></slot>
</template>


<style scoped>
.presentation {
  background: linear-gradient(180deg, #f9fcff 0%, #ffffff 100%);
}

.title-stack {
  width: max-content;
}

.title {
  color: var(--bs-brand);
  animation:
    title-in 0.6s ease-out forwards,
    title-out 1.4s 0.9s ease-out forwards;
  letter-spacing: 1.2px;
}

@keyframes title-in {
  from {
    opacity: 0;
    transform: scale(0.85);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes title-out {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {

  .title {
    animation: none;
    opacity: 1;
  }
}
</style>