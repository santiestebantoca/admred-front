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
import { ref, watch, provide } from 'vue'

const emit = defineEmits(['hidden', 'shown'])
let modal
const vModal = {
  mounted: el => {
    if (props.zindex) el.style.zIndex = props.zindex
    modal = new Modal(el)
    modal.minimize = () => {
      modal._element.classList.remove('show')
      document.querySelectorAll('.modal-backdrop').forEach(e => e.classList.add('d-none'))
      minimized.value = true
      setTimeout(() => modal._element.style.display = 'none', 120)
    }
    modal.restore = () => {
      modal._element.classList.add('show')
      document.querySelectorAll('.modal-backdrop').forEach(e => e.classList.remove('d-none'))
      minimized.value = false
      setTimeout(() => modal._element.style.display = 'block', 120)
    }
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
// Minimize
const minimize = ref(null)
const minimized = ref(null)
provide('dialog:minimize', minimize)
provide('dialog:minimized', minimized)
provide('dialog:onMinimize', () => modal.minimize())
provide('dialog:onRestore', () => modal.restore())
provide('dialog:onClose', () => modal.hide())
</script>

<template>
  <teleport to="body">
    <div class="modal modal-zoom" :class="{ fade: animation }" :data-bs-backdrop="backdrop" tabindex="-1" v-modal>
      <div class="modal-dialog" v-modal-dialog>
        <div class="modal-content shadow" :class="contentClass" v-content>
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.modal.modal-zoom.fade .modal-dialog {
  transition: transform .1s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.1s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(0.9);
  opacity: 0;
}

.modal.modal-zoom.fade.show .modal-dialog {
  transform: scale(1);
  opacity: 1;
}
</style>