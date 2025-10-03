<script setup>
const props = defineProps({
  tag: { type: String, default: 'UL' },
  end: Boolean,
  top: Boolean,
  width: [Number, String],
  maxWidth: [Number, String],
  minWidth: [Number, String],
})
import { computed } from 'vue'
const vStyle = {
  mounted: el => {
    if (props.width)
      el.style.width = `${props.width}px`
    else {
      if (props.maxWidth)
        el.style.maxWidth = `${props.maxWidth}px`
      if (props.minWidth)
        el.style.minWidth = `${props.minWidth}px`
    }
  }
}
const _class = computed(() => {
  const cls = []
  if (props.end) cls.push('dropdown-menu-end')
  if (props.top) cls.push('top-0')
  return cls
})
</script>

<template>
  <component :is="tag" class="dropdown-menu" :class="_class" v-style>
    <slot />
  </component>
</template>

<style scoped>
.dropdown-menu {
  --box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2),
    0px 8px 10px 1px rgba(0, 0, 0, 0.14),
    0px 3px 14px 2px rgba(0, 0, 0, 0.12);
}

.navbar .dropdown-menu {
  box-shadow: none;
}

@media(min-width:992px) {
  .navbar-expand-lg .navbar-nav .dropdown-menu {
    box-shadow: var(--box-shadow);
  }
}

.dropdown-menu {
  box-shadow: var(--box-shadow);
}

/* .w-sm-full */

@media(max-width: 575.98px) {
  .w-sm-full {
    --width: calc(100vw - 8px);
    min-width: var(--width) !important;
    max-width: var(--width) !important;
    width: var(--width) !important;
  }
}
</style>