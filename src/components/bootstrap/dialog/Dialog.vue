<script setup>
const model = defineModel()
const props = defineProps({
  contentClass: String,
  backdrop: { type: Boolean, default: true },
  animation: { type: Boolean, default: true },
  width: Number,
  maxWidth: Number,
  title: String,
  full: Boolean,
  fullSmDown: Boolean,
  scrollable: Boolean,
  lg: Boolean,
  centered: Boolean,
  zindex: String,
})

import { Modal } from 'bootstrap'
import { watch } from 'vue'

const emit = defineEmits(['hidden', 'shown'])
let modal
const vModal = {
  mounted: el => {
    if (props.zindex) el.style.zIndex = props.zindex
    modal = new Modal(el)
    el.addEventListener('hidden.bs.modal', () => {
      emit('hidden')
      model.value = false
    })
    el.addEventListener('shown.bs.modal', () => {
      emit('shown')
      model.value = true
    })
    model.value ? modal.show() : modal.hide()
  },
  unmounted: () => modal.dispose()
}
watch(model, val => val ? modal.show() : modal.hide())

const vModalDialog = el => {
  if (props.full) el.classList.add('modal-fullscreen')
  if (props.fullSmDown) el.classList.add('modal-fullscreen-sm-down')
  if (props.scrollable) el.classList.add('modal-dialog-scrollable')
  if (props.lg) el.classList.add('modal-lg')
  if (props.centered) el.classList.add('modal-dialog-centered')
}

const vContent = el => {
  if (props.maxWidth) el.style.maxWidth = `${props.maxWidth}px`
}
</script>

<template>
  <teleport to="body">
    <div class="modal" :class="{ fade: animation }" :data-bs-backdrop="backdrop" tabindex="-1" v-modal>
      <div class="modal-dialog" v-modal-dialog>
        <div class="modal-content shadow" :class="contentClass" v-content>
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.modal.fade .modal-dialog {
  transition: transform .1s ease-out, opacity .1s ease-out;
  transform: scale(.99);
}

.modal.show .modal-dialog {
  transform: scale(1);
}
</style>