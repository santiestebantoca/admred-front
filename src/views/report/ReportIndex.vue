<script setup>
import IndexDrawer from './IndexDrawer.vue'
import { ref, provide } from 'vue'

const drawer = ref(null)
const title = ref(null)
provide('page:title', title)
</script>

<template>
  <app-layout view="lhh lpr fff" class="layout">
    <app-header>
      <div class="header">
        <bs-btn-menu @click="drawer = true" class="d-xl-none" />
        <span class="header-title" v-text="title" />
      </div>
    </app-header>
    <app-footer>
      <div id="app-footer-content" />
    </app-footer>
    <app-drawer v-model="drawer" width="252" breakpoint="xl" v-slot="{ down }">
      <IndexDrawer :down="down" @hide="drawer = false" />
    </app-drawer>
    <app-page-container>
      <app-page class="page">
        <router-view />
      </app-page>
    </app-page-container>
  </app-layout>
</template>

<style scoped>
.layout {
  --page-padding-x: 12px;
  --header-padding-y: 4px;
  --header-padding-x: 4px;
  --header-title-font-size: 1rem;
  --header-title-font-weight: 600;
  --header-title-line-height: 1;
}

.header {
  padding: var(--header-padding-y) var(--header-padding-x);
  display: flex;
  align-items: center;
  gap: 4px;
}

.header-title {
  font-size: var(--header-title-font-size);
  font-weight: var(--header-title-font-weight);
  line-height: var(--header-title-line-height);
}

.page {
  padding-left: var(--page-padding-x);
  padding-right: var(--page-padding-x);
}

/** xl */
@media(min-width:1200px) {
  .layout {
    --page-padding-x: 32px;
    --header-padding-x: 32px;
    --header-padding-y: 16px;
    --header-title-font-size: 1.25rem;
    --header-title-font-weight: 500;
    --header-title-line-height: 1.2;
  }
}
</style>