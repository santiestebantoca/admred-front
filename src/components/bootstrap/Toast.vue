<script setup>
const props = defineProps({ text: String, color: String, icon: String })

import { Toast } from 'bootstrap'

const emit = defineEmits(['hidden'])
let toast
const vToast = {
  mounted: el => {
    if (props.color) el.classList.add('text-bg-' + props.color)
    else el.classList.add('text-bg-dark')
    toast = new Toast(el).show()
    el.addEventListener('hidden.bs.toast', () => emit('hidden'))
  }
}
</script>

<template>
  <div v-toast class="toast align-items-center border-0 rounded-1" role="alert" aria-live="assertive"
    aria-atomic="true">
    <div class="d-flex p-2">
      <i v-if="icon" :class="'bi-' + icon" class="align-self-center mx-2" />
      <div class="toast-body" v-text="text" />
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close" />
    </div>
  </div>
</template>
