<script setup>
const model = defineModel()
const props = defineProps({
  placement: { type: String, default: 'right' },
  offset: { type: [String, Array], default: '0,0' }, // "10,21"
  arrow: Boolean,
  container: String, // Example: 'body' // if none, we apply triggering element
  customClass: { type: String, default: '' },
  trigger: { type: String },
  fallbackPlacements: { type: Array },
})

import { Popover } from 'bootstrap'
import { watch } from 'vue'

const emit = defineEmits(['hidden', 'shown'])
let popover
const vPopover = {
  mounted: el => {
    const parent = el.parentElement
    parent.setAttribute('data-bs-toggle', 'popover')
    parent.setAttribute('data-bs-custom-class', props.customClass)
    parent.setAttribute('data-bs-offset', props.offset) // in option object, it's more complex
    popover = new Popover(parent,
      {
        html: true,
        content: el.children[0],
        placement: props.placement,
        container: props.container || parent,
        ...props.trigger ? { trigger: props.trigger } : {},
        ...props.trigger === 'hover' ? { delay: { show: 500, hide: 300 } } : {},
        ...props.fallbackPlacements ? { fallbackPlacements: props.fallbackPlacements } : {},
      })
    model.value ? popover.show() : popover.hide()
    el.addEventListener('hidden.bs.popover', () => {
      emit('hidden')
      model.value = false
    })
    el.addEventListener('shown.bs.popover', () => {
      emit('shown')
      model.value = true
    })
  },
  unmounted: () => popover.dispose()
}
watch(model, val => val ? popover.show() : popover.hide())
</script>

<template>
  <span v-popover style="display:none">
    <span>
      <slot />
    </span>
  </span>
</template>
