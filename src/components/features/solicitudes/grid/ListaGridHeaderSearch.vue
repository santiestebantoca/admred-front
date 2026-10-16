<script setup>
import { useSolicitudesFiltro } from '@/stores/solicitudes'
import { toRefs } from 'vue'

const { search } = toRefs(useSolicitudesFiltro())
</script>

<template>
  <BSearchInput searchIcon v-model="search" lazy class="rounded-4" />
</template>

<style scoped>
/** Garantiza una altura de 36px */
:deep([type="search"]) {
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>