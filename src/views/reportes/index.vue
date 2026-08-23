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
      <div class="navbar">
        <div class="container">
          <bs-btn-menu @click="drawer = true" class="d-xl-none" />
          <span class="navbar-brand" v-text="title" />
        </div>
      </div>
    </app-header>
    <app-footer>
      <div id="app-footer-content" />
    </app-footer>
    <app-drawer v-model="drawer" width="252" breakpoint="xl" v-slot="{ down }" class="surface-3">
      <IndexDrawer :down="down" @hide="drawer = false" />
    </app-drawer>
    <app-page-container>
      <app-page class="container">
        <router-view />
      </app-page>
    </app-page-container>
  </app-layout>
</template>