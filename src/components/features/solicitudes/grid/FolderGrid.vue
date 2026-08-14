<script setup>
import GridTable from './table/GridTable.vue'
import GridHeader from './header/GridHeader.vue'
import GridFooter from './footer/GridFooter.vue'
import useFolderStore from '@/stores/folder'
import { watch, inject, watchEffect } from 'vue'

const params = inject('folder:params')
const loading = inject('app:loading')
const folder = useFolderStore()
watch(() => folder.status.loading, val => loading.value = val) // Non blocking `loading`
watchEffect(() => folder.query = { ...params.value })
</script>

<template>
  <div class="grid">
    <GridHeader />
    <GridTable class="overflow-hidden" />
    <GridFooter class="d-none d-lg-block" />
  </div>
</template>

<style scoped>
.grid {
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
}
</style>