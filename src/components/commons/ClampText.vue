<script lang="ts" setup>
const props = defineProps({
  lines: { type: Number, default: 3 },
  lineHeight: { type: Number, default: 1.5 } // --bs-body-line-height
})

import { ref, computed } from 'vue'

const collapsed = ref(true)
const overflow = ref(null)
const rootStyle = computed(() => ({
  '--content-max-height': collapsed.value
    ? `${props.lines * props.lineHeight}rem`
    : 'unset',
  '--footer-display': overflow.value && collapsed.value
    ? 'block'
    : 'hidden',
}))

const vOverflow = (el) => {
  overflow.value = el.offsetHeight < el.scrollHeight
}
</script>

<template>
  <div :style="rootStyle">
    <div class="content" v-overflow>
      <slot></slot>
    </div>
    <div v-if="overflow" class="footer">
      <span class="mark small fw-semibold rounded" type="button" @click="collapsed = false">
        MÁS
      </span>
    </div>
  </div>
</template>

<style scoped>
.content {
  white-space: pre-wrap;
  overflow: hidden;
  max-height: var(--content-max-height);
}

.footer {
  display: var(--footer-display);
}
</style>
