<script lang="ts" setup>
const props = defineProps({
  name: {
    type: String || undefined,
    // required: true,
    validator: (val) => isValidIcon(val) || console.warn(`Icono "${val}" no registrado en UIcon`)
  },
})

import { iconMap, isValidIcon } from './iconMap'
</script>

<template>
  <component v-if="props.name" :is="iconMap[props.name]" />
</template>