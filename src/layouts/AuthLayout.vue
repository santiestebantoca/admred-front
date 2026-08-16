<script lang="ts" setup>
import AppLayout from '@/components/layout/Layout.vue'
import AppHeader from '@/components/layout/Header.vue'
import AppFooter from '@/components/layout/Footer.vue'
import AppPageContainer from '@/components/layout/PageContainer.vue'
import AppPage from '@/components/layout/Page.vue'
</script>

<template>
  <app-layout>
    <!-- <app-header class="py-md-1 bg-light">
      <div class="container text-center">
        <span class="navbar-brand mx-auto">SMS</span>
      </div>
    </app-header> -->
    <app-footer>
      <div id="app-footer-content" />
    </app-footer>
    <app-page-container>
      <app-page>
        <router-view />
      </app-page>
    </app-page-container>
  </app-layout>
</template>
