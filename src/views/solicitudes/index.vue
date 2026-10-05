<script lang="ts" setup>
const props = defineProps({
  tray: String,
  state: String,
  solicitudId: Number,
  linkSolicitud: Function,
  setSolicitudId: Function,
  linkCrear: Object
})

import MainLayout from '@/layouts/MainLayout.vue'
import DrawerContent from '@/components/features/solicitudes/DrawerContent.vue'
import HeaderContent from '@/components/features/solicitudes/header/HeaderContent.vue'
import ListaGrid from '@/components/features/solicitudes/grid/ListaGrid.vue'
import { useSolicitudesFiltro } from '@/stores/solicitudes'
import { ref, computed, provide, watchEffect } from 'vue'

const filaExpandida = ref(false)
const { setFiltroBase } = useSolicitudesFiltro()

watchEffect(() => setFiltroBase(props.tray, props.state))

provide('solicitudes:tray', computed(() => props.tray))
provide('solicitudes:state', computed(() => props.state))
provide('solicitudes:solicitudId', computed(() => props.solicitudId))
provide('solicitudes:linkSolicitud', computed(() => props.linkSolicitud))
provide('solicitudes:setSolicitudId', computed(() => props.setSolicitudId))
provide('solicitudes:linkCrear', computed(() => props.linkCrear))
provide('solicitudes:filaExpandida', filaExpandida)
</script>

<template>
  <MainLayout class="main-layout">
    <template #header-content>
      <HeaderContent />
    </template>
    <template #drawer-content>
      <DrawerContent />
    </template>
    <template #page-content>
      <ListaGrid class="lista-grid" />
      <RouterView />
    </template>
  </MainLayout>
</template>

<style scoped lang="scss">
.main-layout {
  background: linear-gradient(rgba(var(--bs-surface-5-rgb), .1), rgba(var(--bs-surface-5-rgb), .4));

  .lista-grid {
    margin: 0 16px;
    height: calc(100% - 16px);
  }
}
</style>