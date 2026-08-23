<script setup>
import useNavOptions from '../base/nav'
import { watchEffect, inject } from 'vue'

const xlDown = inject('app:xlDown')
const title = inject('page:title')
const navOptions = useNavOptions().options
watchEffect(() => title.value = xlDown.value ? 'Reportes' : '')
</script>

<template>
  <div class="grid">
    <div class="links d-xl-none">
      <bs-btn v-for="_ in navOptions" color="primary" flat class="link" :to="_.to" @click="$emit('hide')">
        <i :class="`bi-${_.icon}`" class="me-3" />
        <span v-text="_.label" />
      </bs-btn>
    </div>
    <i class="bi-graph-up logo d-none d-xl-block" />
  </div>
</template>

<style scoped>
.grid {
  min-height: inherit;
  display: grid;
  align-items: center;
  grid-template-rows: 1fr 72px;
}

.logo {
  font-size: 4rem;
  text-align: center;
  color: var(--bs-gray-300);
}

.links {
  max-width: 220px;
  margin: 0 auto;
}

.link {
  text-align: start;
  width: 100%;
}
</style>