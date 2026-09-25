<script lang="ts" setup>
import AppLayout from '@/components/layout/Layout.vue'
import AppHeader from '@/components/layout/Header.vue'
import AppFooter from '@/components/layout/Footer.vue'
import AppPageContainer from '@/components/layout/PageContainer.vue'
import AppPage from '@/components/layout/Page.vue'
import AppDrawer from '@/components/layout/Drawer.vue'
import { inject } from 'vue'

const mobile = inject('app:mobile')
</script>

<template>
  <app-layout view="lhh lpr fff">
    <app-header>
      <slot name="header-content" />
    </app-header>
    <app-footer>
      <div id="app-footer-content" />
    </app-footer>
    <app-drawer class="border-end surface-3" title="" v-slot="{ up }">
      <slot name="drawer-content" :up="up" />
    </app-drawer>
    <app-page-container>
      <app-page class="container">
        <slot name="page-content" />
      </app-page>
    </app-page-container>
  </app-layout>
</template>