<script setup>
const props = defineProps({
  label: String,
  border: Boolean,
  back: { default: false },
  close: { type: Boolean, default: true },
})

import { computed } from 'vue'

const cbtn = computed(() => !(!props.close || props.back))
const vDialogHeader = el => {
  if (!props.border) el.classList.add('border-0')
}
</script>

<template>
  <div class="modal-header" v-dialog-header>
    <bs-btn-back v-if="back" @click="back" class="btn-back" />
    <h5 v-if="label" class="modal-title" v-text="label" />
    <slot v-else />
    <bs-btn-close v-if="cbtn" data-bs-dismiss="modal" aria-label="Close" />
  </div>
</template>

<style scoped>
.btn-back {
  /* from .modal-header .btn-close */
  margin: calc(-0.5 * var(--bs-modal-header-padding-y)) 0 calc(-0.5 * var(--bs-modal-header-padding-y)) calc(-0.5 * var(--bs-modal-header-padding-x));
  opacity: .75;
}

.btn-back:hover {
  opacity: 1;
}
</style>