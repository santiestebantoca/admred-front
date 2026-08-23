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
  <app-layout :view="mobile ? 'hhh ppp fff' : 'hhh PPP fff'">
    <app-header>
      <slot name="header-content" />
    </app-header>
    <app-footer>
      <div id="app-footer-content" />
    </app-footer>
    <app-drawer class="border-end" title="" v-slot="{ down, closeDrawer }">
      <slot name="drawer-content" :down="down" :closeDrawer="closeDrawer" />
    </app-drawer>
    <app-page-container>
      <app-page class="p-2">
        <slot name="page-content" />
      </app-page>
    </app-page-container>
  </app-layout>
</template>