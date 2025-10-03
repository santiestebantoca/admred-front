<script setup>
const model = defineModel()
</script>

<template>
  <Teleport to="body">
    <template v-if="model">
      <div class="progress-bar-backdrop" />
      <div class="progress-bar" />
    </template>
  </Teleport>
</template>

<style>
.progress-bar-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background-color: rgba(var(--bs-light-rgb), .2); */
  z-index: 1055;
}

.progress-bar {
  position: fixed;
  top: 0;
  left: -100%;
  width: 100%;
  height: 4px;
  background-color: var(--bs-primary);
  animation: slide 1s linear infinite;
  z-index: 1060;
}

@keyframes slide {
  0% {
    left: -100%;
  }

  100% {
    left: 100%;
  }
}
</style>