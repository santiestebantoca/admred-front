<script lang="ts" setup>
import AppPresentation from '@/components/features/app/AppPresentation.vue'
import AppIdle from '@/components/features/app/AppIdle.vue'
import BarraProgreso from '@/components/commons/BarraProgreso.vue'
import { useErroresGlobalesToast } from '@/composables/useErroresGlobalesToast'
import { useBreakpoints, breakpointsBootstrapV5 } from '@vueuse/core'
import { ref, provide } from 'vue'

useErroresGlobalesToast()
const breakpoints = useBreakpoints(breakpointsBootstrapV5)
const mobile = breakpoints.smaller('md') // @media (min-width: 768px)
const xlDown = breakpoints.smaller('xl') // @media (min-width: 1200px)
const defaults = ref({
  BModal: { scrollable: true },
  BPopover: { delay: { show: 500, hide: 5 } },
  BToast: { noProgress: true }
})

provide('app:xlDown', xlDown)
provide('app:mobile', mobile)
</script>

<template>
  <BApp :defaults="defaults">
    <BarraProgreso />
    <AppPresentation>
      <RouterView />
    </AppPresentation>
    <AppIdle :timeout="15" :warning="0.7" @expired="$router.push({ name: 'auth-expired' })" />
  </BApp>
</template>