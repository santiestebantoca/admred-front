<script setup>
const props = defineProps({
  href: String, // default #, causes navigation unless prevent is used 
  label: String,
  icon: String,
  to: [String, Object], // makes compo a router-link
  tag: {
    type: String,
    default(rawProps) {
      return rawProps.to ? 'router-link' : 'a'
    }
  },
  divider: Boolean,
  text: Boolean,
  header: Boolean,
  disable: Boolean,
  variant: String
})

import { computed } from 'vue'

const disable = computed(() => props.disable ? 'disabled' : '')
const attrs = computed(() => ({
  ...props.disable ? { disabled: true } : {},
}))
const cls = computed(() => [
  disable.value,
])
</script>

<template>
  <li>
    <hr v-if="divider" class="dropdown-divider">
    <span v-if="text" class="dropdown-item-text">
      <slot />
    </span>
    <h6 v-else-if="header && label" class="dropdown-header" v-text="label" />
    <h6 v-else-if="header" class="dropdown-header">
      <slot />
    </h6>
    <div v-else-if="variant === 'carousel-title'" class="carousel-title">
      <bs-btn-back @click.stop="$emit('back')" class="me-auto" />
      <span class="mx-auto" v-text="label" />
    </div>
    <component v-else-if="label || $slots.default" :is="tag" class="dropdown-item" type="button" :to="to" :href?="href"
      v-bind="attrs" :class="cls">
      <i v-if="icon" :class="'bi-' + icon" style="font-size:16px" class="me-3" />
      <span v-if="label" v-text="label" class="me-3" />
      <slot />
    </component>
  </li>
</template>

<style scoped>
.carousel-title {
  padding-left: 4px;
  padding-right: 4px;
  display: grid;
  grid-template-columns: 52px 1fr 52px;
  align-items: center;
}
</style>
