<script setup>
const props = defineProps({
  solicitud: Object
})
</script>

<template>
  <div class="root" v-tippy="'Evaluación del remitente'">
    <IBiStarFill v-for="i in 5" :key="i" :class="{ on: solicitud.evaluacion >= i }" />
  </div>
</template>

<style scoped>
.root {
  color: var(--bs-tertiary-color);
  display: flex;
  gap: 8px;
  padding: 4px 6px;
  border-radius: var(--bs-border-radius-lg);
  background-color: var(--bs-light);
  font-size: 10px;

  .on {
    color: var(--bs-warning);
  }
}
</style>