<script setup>
const model = defineModel()

import { provide } from 'vue'

provide('tabs:model', model)
</script>

<template>
  <div class="tab-content">
    <slot />
  </div>
</template>
