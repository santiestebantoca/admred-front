<script setup>
const props = defineProps({
  label: String,
  name: String,
  to: [Object, String],
  replace: [Object, String],
  href: String
})

import { computed, inject } from 'vue'

const model = inject('tabs:model')
const active = computed(() => props.name === model.value)
const tag = computed(() => props.href
  ? 'a'
  : props.to || props.replace
    ? 'router-link'
    : 'div'
)
const attrs = computed(() => ({
  ...props.to ? { to: props.to } : {},
  ...props.href ? { href: props.href } : {},
  ...props.target ? { target: props.target } : {},
  ...props.disable ? { disabled: true } : {},
  ...props.textColor ? { style: { color: props.textColor } } : {},
}))
</script>
<template>
  <li class="nav-item" @click="model = name">
    <template v-if="$slots.default">
      <component :is="tag" class="nav-link" :class="{ active }" type="button" v-bind="attrs">
        <slot />
      </component>
    </template>
    <template v-else>
      <a class="nav-link" :class="{ active }" href="#" v-text="label" @click.prevent />
    </template>
  </li>
</template>