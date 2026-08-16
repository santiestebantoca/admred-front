<script setup>
const props = defineProps({ active: Boolean, disable: Boolean, padding: Boolean })

import BsBtnSave from './ButtonSave.vue'
import BsBtnCancel from './ButtonCancel.vue'
import { computed } from 'vue'

const attrs = computed(() => ({
  active: props.active,
  disable: props.disable
}))
</script>

<template>
  <div class="hstack gap-3" :class="{ 'py-4': padding }">
    <bs-btn-save v-bind="attrs" @click="$emit('save')" />
    <bs-btn-cancel @click="$emit('cancel')" />
  </div>
</template>
