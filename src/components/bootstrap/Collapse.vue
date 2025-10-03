<script setup>
const model = defineModel()
const props = defineProps({
  toggle: { type: Boolean, default: false } // Toggles the collapsible element on invocation
})

import { Collapse } from 'bootstrap'
import { watch } from 'vue'

const emit = defineEmits(['hidden', 'shown'])
let collapse
const vCollapse = {
  mounted: el => {
    collapse = new Collapse(el, { toggle: props.toggle })
    model.value ? collapse.show() : collapse.hide()
    el.addEventListener('hidden.bs.collapse', () => {
      emit('hidden')
      model.value = false
    })
    el.addEventListener('shown.bs.collapse', () => {
      emit('shown')
      model.value = true
    })
  },
  unmounted: () => collapse.dispose()
}
watch(model, val => val ? collapse.show() : collapse.hide())
</script>

<template>
  <div class="collapse" v-collapse>
    <slot />
  </div>
</template>
