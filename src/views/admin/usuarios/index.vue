<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'
import type { Ref } from 'vue'

const props = defineProps<{
  showLista?: boolean
  usuarioId?: number
  linkCrear?: RouteLocationRaw
  setUsuarioId?: (usuarioId: number) => void
}>()

import ListaGrid from '@/components/features/admin/usuarios/ListaGrid.vue'
import { computed, inject, provide } from 'vue'

const title = inject<Ref<string>>('admin:title')
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