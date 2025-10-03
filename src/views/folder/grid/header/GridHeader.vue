<script setup>
import HeaderSearch from './HeaderSearch.vue'
import HeaderActions from './HeaderActions.vue'
import HeaderPeriod from './HeaderPeriod.vue'
import HeaderState from './HeaderState.vue'
import { inject } from 'vue'

const params = inject('folder:params')
const mobile = inject('app:mobile')
</script>

<template>
  <div class="d-flex hstack" :class="[mobile ? 'p-1' : 'p-3']">
    <HeaderPeriod v-if="params.state === 'terminadas'" />
    <HeaderState v-else />
    <template v-if="!mobile">
      <HeaderSearch class="ms-auto me-2" />
      <HeaderActions />
    </template>
  </div>
</template>

<style scoped>
.container-fluid {}
</style>