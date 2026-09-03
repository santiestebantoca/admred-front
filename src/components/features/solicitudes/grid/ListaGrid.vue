<script setup>
import ListaGridHeader from './header/ListaGridHeader.vue'
import ListaGridTable from './table/ListaGridTable.vue'
// import ListaGridFooter from './footer/ListaGridFooter.vue'
import { useSolicitudesQuery } from '@/stores/solicitudes'
import { inject, watchEffect } from 'vue'

const params = inject('solicitudes:params')
// const mobile = inject('app:mobile')
const query = inject('solicitudes:query')
const { params: queryParams } = useSolicitudesQuery()

watchEffect(() => queryParams.value = { ...params.value, ...query.value })
</script>

<template>
  <div class="grid">
    <div class="header-table">
      <ListaGridHeader />
      <ListaGridTable class="overflow-hidden" />
    </div>
    <!-- <ListaGridFooter :class="{ 'd-none': mobile }" /> -->
  </div>
</template>

<style scoped>
.grid {
  height: 100%;
  display: grid;
  grid-template-rows: 1fr auto;

  .header-table {
    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr;
    overflow: hidden;
    border: 1px solid var(--bs-border-color);
    border-radius: var(--bs-border-radius-xl);
    background-color: white;
  }
}
</style>