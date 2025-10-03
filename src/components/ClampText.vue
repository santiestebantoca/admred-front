<script setup>
const props = defineProps({
  lines: { type: Number, default: 3 },
  lineHeight: { type: Number, default: 1.5 } // --bs-body-line-height
})

import { ref } from 'vue'

const height = ref(`${props.lines * props.lineHeight}rem`)
const overflow = ref(null)
const vOverflow = el => overflow.value = el.offsetHeight < el.scrollHeight
</script>

<template>
  <div :class="{ overflow }">
    <div class="a" v-overflow>
      <slot></slot>
    </div>
    <div v-if="height" class="b mt-1">
      <bs-badge rounded color="info" type="button" @click="height = null" label="MÁS" />
    </div>
  </div>
</template>

<style scoped>
.a {
  white-space: pre-wrap;
  overflow: hidden;
  /* --line-clamp: v-bind(lines);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--line-clamp, none); */
  /* another less beautiful but more compatible way:
   --bs-body-line-height = 1.5 */
  --max-height: v-bind(height);
  max-height: var(--max-height);
}

.b {
  display: none;
}

.overflow .b {
  display: block;
}
</style>
