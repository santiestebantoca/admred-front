<script setup>
import ListaGridHeader from './ListaGridHeader.vue'
import ListaGridTable from './ListaGridTable.vue'
import ListaHeader from '@/components/features/solicitudes/ListaHeader.vue'
import ListaGridFooter from './ListaGridFooter.vue'
import { inject } from 'vue'

const mobile = inject('app:mobile')
</script>

<template>
  <div class="root">
    <ListaHeader />
    <div class="grid px-3 py-1">
      <ListaGridHeader class="py-2" />
      <ListaGridTable class="overflow-hidden me-n3" />
      <ListaGridFooter :class="{ 'd-none': mobile }" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.root {
  // height: calc(100% - 8px); // en el componente padre
  display: grid;
  grid-template-rows: auto 1fr;
  row-gap: 8px;

  .grid {
    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr auto;
    overflow: hidden;
    border: 1px solid var(--bs-gray-200);
    border-radius: var(--bs-border-radius-xl); // lg
    background-color: white;
  }
}
</style>