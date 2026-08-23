<script lang="ts" setup>
const props = defineProps({
  params: Object,
  query: Object,
  compose: Object
})

import MainLayout from '@/layouts/MainLayout.vue'
import DrawerContent from '@/components/features/solicitudes/DrawerContent.vue'
import HeaderContent from '@/components/features/solicitudes/header/HeaderContent.vue'
import ListaHeader from '@/components/features/solicitudes/ListaHeader.vue'
import ListaGrid from '@/components/features/solicitudes/grid/ListaGrid.vue'
import { provide, computed } from 'vue'

provide('solicitudes:params', computed(() => props.params))
provide('solicitudes:query', computed(() => props.query))

// const props = defineProps({ baseQuery: Object, compose: Object })

// import IndexNav from '@/components/features/solicitudes/IndexNav.vue'
// 
// import FolderGrid from '@/components/features/solicitudes/grid/FolderGrid.vue'
// import ItemCreate from '../item/forms/ItemFormCreate.vue'
// import { ref, computed, provide, inject } from 'vue'

// const mobile = inject('app:mobile')
// const drawer = ref(null)
// const tray = computed(() => props.baseQuery.tray)
// const state = computed(() => props.baseQuery.state)
// provide('folder:params', computed(() => ({ tray: tray.value, state: state.value })))
// computed(()=> props.baseQuery) is too reactive (at any route change)
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
  <!-- <ItemCreate v-if="compose.new" @close="compose.back" /> -->
</template>
