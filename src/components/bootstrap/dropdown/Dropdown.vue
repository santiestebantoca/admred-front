<script setup>
const props = defineProps({
  tag: { type: String, default: 'DIV' },
  up: Boolean
})

import { computed } from 'vue'

const _class = computed(() => {
  let cls = props.up ? 'btn-group dropup' : 'dropdown'
  return cls
})
</script>

<template>
  <component :is="tag" :class="_class">
    <slot />
  </component>
</template>
