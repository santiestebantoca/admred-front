<script lang="ts" setup>
import { useSolicitudesFiltro } from '@/stores/solicitudes'
import { toRefs } from 'vue'

const { search } = toRefs(useSolicitudesFiltro())
</script>

<template>
  <BSearchInput searchIcon v-model="search" lazy class="rounded-4" />
</template>