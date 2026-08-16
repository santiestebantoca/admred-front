<!-- 
 None of these combinations work fine (e.g. ItemView back button displaying tootip)
  // beforeUnmount: () => setTimeout(() => tooltip?.dispose(), 400),
  // unmounted: () => tooltip?.dispose() 
-->
<script setup>
const model = defineModel()
const props = defineProps({
  placement: { type: String, default: 'right' },
  offset: { type: [String, Array], default: '0,0' }, // "10,21"
  fallbackPlacements: { type: Array },
  customClass: String,
})

import { Tooltip } from 'bootstrap'
import { watch, onBeforeUnmount } from 'vue'

const emit = defineEmits(['hidden', 'shown'])
let tooltip
const vTooltip = {
  mounted: el => {
    const parent = el.parentElement
    parent.setAttribute('data-bs-toggle', 'tooltip')
    props.customClass &&
      parent.setAttribute('data-bs-custom-class', props.customClass)
    parent.setAttribute('data-bs-offset', props.offset) // in option object, it's more complex
    tooltip = new Tooltip(parent,
      {
        delay: { show: 1000, hide: 50 },
        html: true,
        title: el.innerHTML,
        placement: props.placement,
        trigger: 'hover',
        ...props.fallbackPlacements ? { fallbackPlacements: props.fallbackPlacements } : {},
      })
    // Tooltip remains shown on button click.
    // It also shows up even if button has been clicked.
    // This is my correction.
    parent.onmousedown = () => {
      tooltip.disable()
      tooltip.hide()
    }
    parent.onmouseenter = () => tooltip.enable()
    //
    el.addEventListener('hidden.bs.tooltip', () => {
      emit('hidden')
      model.value = false
    })
    el.addEventListener('shown.bs.tooltip', () => {
      emit('shown')
      model.value = true
    })
  }
}
watch(model, val => val ? tooltip?.show() : tooltip?.hide())
onBeforeUnmount(() => setTimeout(() => tooltip?.dispose(), 400))
</script>

<template>
  <span v-tooltip style="display:none">
    <slot />
  </span>
</template>