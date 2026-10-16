<script setup>
const props = defineProps({
  showLista: Boolean,
  usuarioId: Number,
  linkCrear: Object,
  setUsuarioId: Function
})

import ListaGrid from '@/components/features/admin/usuarios/ListaGrid.vue'
import { computed, inject, provide } from 'vue'

const title = inject('admin:title')
provide('admin:usuarios:usuarioId', computed(() => props.usuarioId))
provide('admin:usuarios:linkCrear', computed(() => props.linkCrear))
provide('admin:usuarios:setUsuarioId', computed(() => props.setUsuarioId))

title.value = 'Usuarios del sistema'
</script>

<template>
  <div class="pt-3 pb-4">
    <ListaGrid v-show="showLista" />
    <router-view />
  </div>
</template>