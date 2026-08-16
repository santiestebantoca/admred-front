<script setup>
// This compo is designed in the style of Quasar's Badge
const props = defineProps({
  // content
  label: [String, Number],
  floating: Boolean,
  inset: Boolean, // remove translate-middle
  align: { type: String, default: 'top' },
  // style
  color: { type: String, default: 'secondary' },
  rounded: Boolean,
  outline: Boolean,
})

const vBadge = el => {
  // content
  // const parent = el.parentNode
  if (props.floating) {
    el.classList.add('position-absolute')
    // if (props.align === 'top') el.classList.add('top-0')
    // if (props.align === 'middle') el.classList.add('top-0')
    // else if (props.align === 'bottom') el.classList.add('bottom-0')

    if (props.inset) el.classList.add('end-0')
    else el.classList.add('start-100', 'translate-middle')
  }
  // style
  if (props.outline) {
    el.classList.add('border', 'border-' + props.color)
    el.classList.add('text-' + props.color)
  }
  else el.classList.add('text-bg-' + props.color)
  if (props.rounded) el.classList.add('rounded-pill')
} 
</script>

<template>
  <span v-badge class="badge">
    <span v-if="label" v-text="label" />
    <slot v-else />
  </span>
</template>

<style scoped>
.badge:empty {
  display: inline-block;
  padding: 4.5px;
  outline: white solid 1px;
}
</style>