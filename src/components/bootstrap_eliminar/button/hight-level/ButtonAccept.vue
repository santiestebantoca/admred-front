<script setup>
const props = defineProps({ active: Boolean, disable: Boolean })

import BsBtn from '../Button.vue'
import { computed } from 'vue'

const attrs = computed(() => ({
  label: 'Aceptar',
  disable: props.active || props.disable
}))
</script>

<template>
  <bs-btn color="primary" v-bind="attrs" style="min-width:106px" />
</template>
