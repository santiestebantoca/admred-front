<script lang="ts" setup>
const props = defineProps({
  params: Object,
  query: Object,
  flows: Object
})

import MainLayout from '@/layouts/MainLayout.vue'
import DrawerContent from '@/components/features/solicitudes/DrawerContent.vue'
import HeaderContent from '@/components/features/solicitudes/header/HeaderContent.vue'
import ListaHeader from '@/components/features/solicitudes/ListaHeader.vue'
import ListaGrid from '@/components/features/solicitudes/grid/ListaGrid.vue'
import CrearSolicitud from '@/views/solicitudes/_flows/crear.vue'
import Solicitud from '@/views/solicitudes/_flows/solicitud.vue'
import { ref, computed, provide } from 'vue'

const filaExpandida = ref(false)

provide('solicitudes:params', computed(() => props.params))
provide('solicitudes:query', computed(() => props.query))
provide('solicitudes:flows', computed(() => props.flows))
provide('solicitudes:filaExpandida', filaExpandida)
</script>

<template>
  <MainLayout style="background-color: var(--bs-surface-2);">
    <template #header-content>
      <HeaderContent />
      <ListaHeader />
    </template>
    <template #drawer-content="{ down, closeDrawer }">
      <DrawerContent :down="down" :closeDrawer="closeDrawer" />
    </template>
    <template #page-content>
      <ListaGrid class="border rounded-4 bg-white" />
    </template>
  </MainLayout>
  <CrearSolicitud v-if="flows.crear.active" :back="flows.crear.back" />
  <Solicitud v-if="flows.solicitud.active" :back="flows.solicitud.back" />
</template>
