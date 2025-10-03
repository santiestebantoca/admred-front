<script setup>
const props = defineProps({
  trHeight: { type: String, default: '42px' },
})
</script>

<template>
  <div class="scroller-container">
    <slot />
  </div>
</template>

<style scoped>
.scroller-container {
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  max-height: 100%;
}

.scroller-container :deep(table tr) {
  scroll-snap-align: start;
}
</style>