<script lang="ts" setup>
import AppPresentation from '@/components/features/app/AppPresentation.vue'
import AppIdle from '@/components/features/app/AppIdle.vue'
import { useErroresGlobalesToast } from '@/composables/useErroresGlobalesToast'
import { useBreakpoints, breakpointsBootstrapV5 } from '@vueuse/core'
import { ref, provide } from 'vue'

useErroresGlobalesToast()
const breakpoints = useBreakpoints(breakpointsBootstrapV5)
const mobile = breakpoints.smaller('md') // @media (min-width: 768px)
const xlDown = breakpoints.smaller('xl') // @media (min-width: 1200px)
const loading = ref(0)
const defaults = ref({
  BModal: { scrollable: true },
  BPopover: { delay: { show: 500, hide: 5 } },
  BToast: { noProgress: true }
})

provide('app:xlDown', xlDown)
provide('app:mobile', mobile)
provide('app:loading', loading)
</script>

<template>
  <BApp :defaults="defaults">
    <AppPresentation>
      <RouterView />
    </AppPresentation>
    <AppIdle :timeout="15" :warning="0.7" @expired="$router.push({ name: 'auth-expired' })" />
  </BApp>
</template>