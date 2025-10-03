<script setup>
// App states
//  (auth===null)
//  (Navigation guard: notRequiresAuth) -> RequestedView *
//  (Navigation guard: requiresAuth) -> (get authUser)
//  | (auth===false) -> LoginView -> HomeView *
//  | (auth) -> RequestedView *
//  (inactivity) -> ExpirationView:logout() -> {PreviousView}
//  (server401) -> LoginView:logout() :: should never happend
//  (logout) -> LogoutView:logout() -> LoginView
import AppPresentation from './views/app/AppPresentation.vue'
import AppIdle from './views/app/AppIdle.vue'
import AppSnackbar from './views/app/AppSnackbar.vue'
import AppLoading from '@/views/app/AppLoading.vue'
import ItemFrame from './views/item/ItemFrame.vue'
import { useBreakpoints, breakpointsBootstrapV5 } from '@vueuse/core'
import { ref, provide } from 'vue'

const loading = ref(0)
const breakpoints = useBreakpoints(breakpointsBootstrapV5)
const mobile = breakpoints.smaller('md') // @media (min-width: 768px)
const xlDown = breakpoints.smaller('xl') // @media (min-width: 1200px)
provide('app:xlDown', xlDown)
provide('app:mobile', mobile)
provide('app:loading', loading)
//
const server = ref(window.location.hostname)
</script>

<template>
  <div v-if="server === '192.168.90.169'">
    La aplicación ADM Red ya no está disponible en el enlace
    <a href="https://192.168.90.169/" disabled>https://192.168.90.169/</a>. <br>
    En su lugar use el enlace
    <a href="https://admred.vpor.etecsa.cu/">https://admred.vpor.etecsa.cu/</a>.
  </div>
  <template v-else>
    <AppPresentation>
      <RouterView />
    </AppPresentation>
    <AppIdle :timeout="15" :warning="0.7" @expired="$router.push({ name: 'auth-expired' })" />
    <AppSnackbar />
    <ItemFrame />
    <AppLoading v-model="loading" />
  </template>
</template>

<style>
a[disabled] {
  color: var(--bs-secondary);
  pointer-events: none;
  cursor: not-allowed;
}
</style>