<script setup>
const props = defineProps({
  showLista: Boolean,
  linkCrear: Object
})

import ListaGrid from '@/components/features/admin/tipos/ListaGrid.vue'
import { inject } from 'vue'

const title = inject('admin:title')

title.value = 'Tipos de solicitud'
</script>

<template>
  <!-- <template v-show="showLista"> -->
  <ListaGrid :linkCrear="linkCrear" />
  <!-- </template> -->
  <router-view />
</template>