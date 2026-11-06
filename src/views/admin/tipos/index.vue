<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'
import type { Ref } from 'vue'

const props = defineProps<{
  showLista?: boolean
  tipoId?: number
  linkCrear?: RouteLocationRaw
  setTipoId?: (tipoId: number) => void
}>()

import ListaGrid from '@/components/features/admin/tipos/ListaGrid.vue'
import { computed, inject, provide } from 'vue'

const title = inject<Ref<string>>('admin:title')
provide('admin:tipos:tipoId', computed(() => props.tipoId))
provide('admin:tipos:linkCrear', computed(() => props.linkCrear))
provide('admin:tipos:setTipoId', computed(() => props.setTipoId))

title.value = 'Tipos de solicitud'
</script>

<template>
  <div class="pt-3 pb-4">
    <ListaGrid v-show="showLista" />
    <router-view />
  </div>
</template>