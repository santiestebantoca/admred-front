<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'
import type { Ref } from 'vue'
import type { ContextoCrearArea } from '@/stores/areas'

const props = defineProps<{
  showLista?: boolean
  areaId?: number
  linkCrear?: (contexto?: ContextoCrearArea) => RouteLocationRaw
  setAreaId?: (areaId: number) => void
}>()

import ListaGrid from '@/components/features/admin/areas/ListaGrid.vue'
import ListaNavegador from '@/components/features/admin/areas/ListaNavegador.vue'
import { computed, inject, provide } from 'vue'
import { useStorage } from '@vueuse/core'

const title = inject<Ref<string>>('admin:title')
const modo = useStorage<'lista' | 'navegar'>('admred_areas_modo', 'lista', sessionStorage)

provide('admin:areas:areaId', computed(() => props.areaId))
provide('admin:areas:linkCrear', computed(() => props.linkCrear))
provide('admin:areas:setAreaId', computed(() => props.setAreaId))

title.value = 'Áreas'
</script>

<template>
  <div class="pt-3 pb-4">
    <ListaGrid v-show="showLista && modo === 'lista'" v-model:modo="modo" />
    <ListaNavegador v-show="showLista && modo === 'navegar'" v-model:modo="modo" />
    <router-view />
  </div>
</template>
