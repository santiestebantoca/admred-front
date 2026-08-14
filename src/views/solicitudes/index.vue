<script setup>
const props = defineProps({ baseQuery: Object, compose: Object })

import IndexNav from '@/components/features/solicitudes/IndexNav.vue'
import IndexDrawer from '@/components/features/solicitudes/IndexDrawer.vue'
import FolderHeader from '@/components/features/solicitudes/header/FolderHeader.vue'
import FolderGrid from '@/components/features/solicitudes/grid/FolderGrid.vue'
import ItemCreate from '../item/forms/ItemFormCreate.vue'
import { ref, computed, provide, inject } from 'vue'

const mobile = inject('app:mobile')
const drawer = ref(null)
const tray = computed(() => props.baseQuery.tray)
const state = computed(() => props.baseQuery.state)
provide('folder:params', computed(() => ({ tray: tray.value, state: state.value })))
// computed(()=> props.baseQuery) is too reactive (at any route change)
</script>

<template>
  <app-layout :view="mobile ? 'lhh lpr lff' : 'hhh lPr fff'" style="background-color:  var(--bs-surface-1);">
    <app-header>
      <IndexNav>
        <bs-btn-menu @click="drawer = true" v-if="mobile" />
      </IndexNav>
      <FolderHeader />
    </app-header>
    <app-drawer v-model="drawer" width="252" v-if="mobile" v-slot="{ down }">
      <IndexDrawer :down="down" @hide="drawer = false" />
    </app-drawer>
    <app-page-container :class="{ 'bg-light-1': mobile }">
      <app-page class="p-2">
        <FolderGrid class="border rounded-4 bg-white" />
      </app-page>
    </app-page-container>
  </app-layout>
  <ItemCreate v-if="compose.new" @close="compose.back" />
</template>
