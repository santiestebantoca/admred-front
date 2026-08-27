<script setup>
import ListaGridHeader from './header/ListaGridHeader.vue'
import ListaGridTable from './table/ListaGridTable.vue'
// import ListaGridFooter from './footer/ListaGridFooter.vue'
import { useSolicitudesQuery } from '@/stores/solicitudes'
import { inject, watchEffect } from 'vue'

const params = inject('solicitudes:params')
const query = inject('solicitudes:query')
const { params: queryParams } = useSolicitudesQuery()

watchEffect(() => queryParams.value = { ...params.value, ...query.value })
</script>

<template>
  <div class="grid">
    <ListaGridHeader />
    <ListaGridTable class="overflow-hidden" />
    <!-- <GridFooter class="d-none d-lg-block" /> -->
  </div>
</template>

<style scoped>
.grid {
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
}
</style>