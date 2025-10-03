<script setup>
import { ref, onMounted } from 'vue'

const presentation = ref(performance.getEntriesByType('navigation')
  .some(d => d.type === 'navigate'))
onMounted(() => setTimeout(() => presentation.value = false, 2000))
</script>

<template>
  <div v-if="presentation" class="container-fluid hstack vh-100">
    <transition appear>
      <div class="mx-auto">
        <h4 class="fw-semibold" style="color: #00235d">ADM Red</h4>
      </div>
    </transition>
  </div>
  <slot v-else></slot>
</template>


<style scoped>
.v-enter-active {
  transition: all 2s;
}

.v-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
</style>