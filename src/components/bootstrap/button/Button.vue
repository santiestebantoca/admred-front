<!-- 
  This compo is designed with BS but in the style of Quasar's Button
  Using round (usualy for only icon) on anchor element causes verical alignment issue
 -->
<script setup>
const props = defineProps({
  // content
  label: [String, Number],
  icon: String,
  iconRight: String,
  align: { type: String, default: 'center' }, // left right center around between evenly
  stack: Boolean,
  // general
  type: {
    type: String,
    default(rawProps) {
      return ['submit', 'reset'].includes(rawProps.type)
        ? rawProps.type
        : 'button'
    }
  },
  // navigation
  to: [String, Object],
  replace: Boolean,
  href: String,
  target: String,
  // state
  loading: Boolean,
  disable: Boolean,
  active: Boolean,
  // style
  size: { type: String, default: 'unset' },
  outline: Boolean, // outline design
  flat: Boolean, // flat design
  rounded: Boolean,
  square: Boolean,
  padding: String, // custom padding 16px (10px 5px) 
  //
  color: String, // transparent if not provided 
  textColor: String, // overrides text color (if needed) Bootstrap colors
  textSmall: Boolean, // label text size 
  dense: Boolean,
  round: Boolean, // makes a circle shaped button (for icon)
  // methods
  click: { type: Function, default: () => { } } // emulate click
})

import { computed, watchEffect } from 'vue'

const tag = computed(() => props.href
  ? 'a'
  : props.to || props.replace
    ? 'router-link'
    : 'button'
)
const disable = computed(() => props.disable ? 'disabled' : '')
const round = computed(() => props.round ? 'rounded-circle' : '')
const rounded = computed(() => props.rounded ? 'rounded-pill' : '')
const square = computed(() => props.square ? 'rounded-0' : '')
const stack = computed(() => props.stack ? 'vstack flex-grow-0' : '')
const colors = computed(() => {
  const cls = []
  if (props.color) {
    const bs = [
      'primary',
      'secondary',
      'success',
      'danger',
      'warning',
      'info',
      'light',
      'dark',
      'white',
    ]
    if (props.flat) {
      if (bs.includes(props.color)) {
        cls.push('btn-link link-' + props.color)
        cls.push('text-decoration-none')
      }
    }
    else {
      if (bs.includes(props.color)) {
        cls.push('btn-' + props.color)
      }
    }
  }
  if (props.flat) cls.push('flat')
  return cls
})

const vButton = el => {
  watchEffect(() => props.outline ? el.classList.add('outline') : el.classList.remove('outline'))
  watchEffect(() => {
    if (['sm', 'lg'].includes(props.size)) el.classList.add('btn-' + props.size)
    else el.classList.remove('btn-sm', 'btn-lg')
  })
}
const attrs = computed(() => ({
  ...props.to ? { to: props.to } : {},
  ...props.href ? { href: props.href } : {},
  ...props.target ? { target: props.target } : {},
  ...props.disable ? { disabled: true } : {},
}))
const cls = computed(() => [
  'btn',
  disable.value,
  round.value,
  rounded.value,
  square.value,
  stack.value,
  colors.value,
  ...props.active ? ['active'] : []
])
// css
const iconMargin = computed(() => props.label ? '.5em' : 'unset')
const size = computed(() => props.size.match(/^[0-9]+(px|em|%)$/) ? props.size : 'unset')
const color = computed(() => props.textColor ? props.textColor : 'inherit')
</script>

<template>
  <component v-button :is="tag" :type="type" v-bind="attrs" :class="cls" @click="click">
    <i v-if="icon" :class="'icon bi-' + icon" />
    <span v-if="label" v-text="label" :class="{ small: textSmall }" />
    <i v-if="iconRight" :class="'icon-right bi-' + iconRight" />
    <slot />
  </component>
</template>

<style scoped>
.btn {
  --bs-btn-border-color: transparent;
  --bs-btn-active-border-color: transparent;
  --bs-btn-disabled-border-color: transparent;
  --bs-btn-close-focus-shadow: none;
  --icon-margin: v-bind(iconMargin);
  min-height: v-bind(size);
  min-width: v-bind(size);
  position: relative;
}

.btn * {
  color: v-bind(color);
}

:not(.vstack)>.icon {
  margin-right: var(--icon-margin);
}

:not(.vstack)>.icon-right {
  margin-left: var(--icon-margin);
}

.btn.flat::before {
  content: '';
  position: absolute;
  top: -1px;
  bottom: -1px;
  left: -1px;
  right: -1px;
  border-radius: inherit;
  background-color: currentColor;
  opacity: 0;
  transition: .2s;
}

.btn.flat.active::before,
.btn.flat:hover::before,
.btn.flat.router-link-active::before {
  opacity: .075;
}

/** outline (for flat buttons) */

.btn-primary.flat.outline,
.link-primary.flat.outline {
  --bs-btn-border-color: rgba(var(--bs-primary-rgb), .3);
}

.btn-primary.flat.outline:hover,
.link-primary.flat.outline:hover {
  --bs-btn-hover-border-color: rgba(var(--bs-primary-rgb), .6);
}

.btn-primary.flat.outline:active,
.link-primary.flat.outline:active,
.btn-primary.flat.outline.active,
.link-primary.flat.outline.active {
  --bs-btn-active-border-color: rgba(var(--bs-primary-rgb), .6);
}

.btn-success.flat.outline,
.link-success.flat.outline {
  --bs-btn-border-color: rgba(var(--bs-success-rgb), .3);
}

.btn-success.flat.outline:hover,
.link-success.flat.outline:hover {
  --bs-btn-hover-border-color: rgba(var(--bs-success-rgb), .6);
}

.btn-success.flat.outline:active,
.link-success.flat.outline:active,
.btn-success.flat.outline.active,
.link-success.flat.outline.active {
  --bs-btn-active-border-color: rgba(var(--bs-success-rgb), .6);
}

.btn-secondary.flat.outline,
.link-secondary.flat.outline {
  --bs-btn-border-color: rgba(var(--bs-secondary-rgb), .3);
}

.btn-secondary.flat.outline:hover,
.link-secondary.flat.outline:hover {
  --bs-btn-hover-border-color: rgba(var(--bs-secondary-rgb), .6);
}

.btn-secondary.flat.outline:active,
.link-secondary.flat.outline:active,
.btn-secondary.flat.outline.active,
.link-secondary.flat.outline.active {
  --bs-btn-active-border-color: rgba(var(--bs-secondary-rgb), .6);
}

.btn-danger.flat.outline,
.link-danger.flat.outline {
  --bs-btn-border-color: rgba(var(--bs-danger-rgb), .3);
}

.btn-danger.flat.outline:hover,
.link-danger.flat.outline:hover {
  --bs-btn-hover-border-color: rgba(var(--bs-danger-rgb), .3);
}

.btn-danger.flat.outline:active,
.link-danger.flat.outline:active,
.btn-danger.flat.outline.active,
.link-danger.flat.outline.active {
  --bs-btn-active-border-color: rgba(var(--bs-danger-rgb), .6);
}

.btn-warning.flat.outline,
.link-warning.flat.outline {
  --bs-btn-border-color: rgba(var(--bs-warning-rgb), .3);
}

.btn-warning.flat.outline:hover,
.link-warning.flat.outline:hover {
  --bs-btn-hover-border-color: rgba(var(--bs-warning-rgb), .6);
}

.btn-warning.flat.outline:active,
.link-warning.flat.outline:active,
.btn-warning.flat.outline.active,
.link-warning.flat.outline.active {
  --bs-btn-active-border-color: rgba(var(--bs-warning-rgb), .6);
}

.btn-info.flat.outline,
.link-info.flat.outline {
  --bs-btn-border-color: rgba(var(--bs-info-rgb), .3);
}

.btn-info.flat.outline:hover,
.link-info.flat.outline:hover {
  --bs-btn-hover-border-color: rgba(var(--bs-info-rgb), .6);
}

.btn-info.flat.outline:active,
.link-info.flat.outline:active,
.btn-info.flat.outline.active,
.link-info.flat.outline.active {
  --bs-btn-active-border-color: rgba(var(--bs-info-rgb), .6);
}

.btn-light.flat.outline,
.link-light.flat.outline {
  --bs-btn-border-color: rgba(var(--bs-light-rgb), .3);
}

.btn-light.flat.outline:hover,
.link-light.flat.outline:hover {
  --bs-btn-hover-border-color: rgba(var(--bs-light-rgb), .6);
}

.btn-light.flat.outline:active,
.link-light.flat.outline:active,
.btn-light.flat.outline.active,
.link-light.flat.outline.active {
  --bs-btn-active-border-color: rgba(var(--bs-light-rgb), .6);
}

.btn-dark.flat.outline,
.link-dark.flat.outline {
  --bs-btn-border-color: rgba(var(--bs-dark-rgb), .3);
}

.btn-dark.flat.outline:hover,
.link-dark.flat.outline:hover {
  --bs-btn-hover-border-color: rgba(var(--bs-dark-rgb), .6);
}

.btn-dark.flat.outline:active,
.link-dark.flat.outline:active,
.btn-dark.flat.outline.active,
.link-dark.flat.outline.active {
  --bs-btn-active-border-color: rgba(var(--bs-dark-rgb), .6);
}

.btn-white.flat.outline,
.link-white.flat.outline {
  --bs-btn-border-color: rgba(var(--bs-white-rgb), .3);
}

.btn-white.flat.outline:hover,
.link-white.flat.outline:hover {
  --bs-btn-hover-border-color: rgba(var(--bs-white-rgb), .6);
}

.btn-white.flat.outline:active,
.link-white.flat.outline:active,
.btn-white.flat.outline.active,
.link-white.flat.outline.active {
  --bs-btn-active-border-color: rgba(var(--bs-white-rgb), .6);
}
</style>
