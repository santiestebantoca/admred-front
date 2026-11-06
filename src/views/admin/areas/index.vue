<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'
import type { Ref } from 'vue'

const props = defineProps<{
  showLista?: boolean
  areaId?: number
  linkCrear?: RouteLocationRaw
  setAreaId?: (areaId: number) => void
}>()

import ListaGrid from '@/components/features/admin/areas/ListaGrid.vue'
import { computed, inject, provide } from 'vue'

const title = inject<Ref<string>>('admin:title')
provide('admin:areas:areaId', computed(() => props.areaId))
provide('admin:areas:linkCrear', computed(() => props.linkCrear))
provide('admin:areas:setAreaId', computed(() => props.setAreaId))

title.value = 'Áreas'
</script>

<template>
  <div class="pt-3 pb-4">
    <ListaGrid v-show="showLista" />
    <router-view />
  </div>
</template>