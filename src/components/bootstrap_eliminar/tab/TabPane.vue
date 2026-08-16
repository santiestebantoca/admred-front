<script setup>
const props = defineProps({ name: String })

import { computed, inject } from 'vue'

const model = inject('tabs:model')
const active = computed(() => props.name === model.value)
</script>

<template>
  <div class="tab-pane" :class="{ active }" tabindex="0">
    <slot />
  </div>
</template>
