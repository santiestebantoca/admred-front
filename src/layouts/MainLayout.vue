<script lang="ts" setup>
import AppLayout from '@/components/layout/Layout.vue'
import AppHeader from '@/components/layout/Header.vue'
import AppFooter from '@/components/layout/Footer.vue'
import AppPageContainer from '@/components/layout/PageContainer.vue'
import AppPage from '@/components/layout/Page.vue'
import AppDrawer from '@/components/layout/Drawer.vue'
import HeaderContent from '@/components/features/app/HeaderContent.vue'
</script>

<template>
  <app-layout view="hhh lPr fff">
    <app-header class="bg-white">
      <HeaderContent />
    </app-header>
    <app-footer>
      <div id="app-footer-content" />
    </app-footer>
    <app-drawer breakpoint="lg" class="border-end" title="SMS" v-slot="{ down, closeDrawer }">
      <slot name="drawer-content" :down="down" :closeDrawer="closeDrawer" />
    </app-drawer>
    <app-page-container>
      <app-page>
        <router-view />
      </app-page>
    </app-page-container>
  </app-layout>
</template>
