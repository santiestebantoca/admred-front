<script lang="ts" setup>
const props = defineProps({ next: Function })
</script>

<template>
  <div class="grid">
    <div class="card border-0 shadow p-3 mb-5">
      <p>Tiempo de sesión expirado.</p>
      <br>
      <div class="text-end">
        <BButton @click="next" color="primary">
          Continuar trabajando
        </BButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  max-width: 400px;
  margin: 0 auto;
  min-height: inherit;
  display: grid;
  align-items: center;
}

@media (max-width: 767.98px) {
  .shadow {
    box-shadow: none !important;
  }
}
</style>