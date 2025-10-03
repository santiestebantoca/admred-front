<script setup>
const model = defineModel()
const props = defineProps({
  lg: Boolean,
  xl: Boolean,
  xxl: Boolean
})

import { Offcanvas } from 'bootstrap'
import { watch } from 'vue'

const emit = defineEmits(['hidden', 'shown'])
let offcanvas
const vOffcanvas = {
  mounted: el => {
    if (props.lg) el.classList.add('offcanvas-lg')
    if (props.xl) el.classList.add('offcanvas-xl')
    if (props.xxl) el.classList.add('offcanvas-xxl')
    else el.classList.add('offcanvas')
    offcanvas = new Offcanvas(el)
    model.value ? offcanvas.show() : offcanvas.hide()
    el.addEventListener('hidden.bs.offcanvas', () => {
      emit('hidden')
      model.value = false
    })
    el.addEventListener('shown.bs.offcanvas', () => {
      emit('shown')
      model.value = true
    })
  },
  unmounted: () => offcanvas.dispose()
}
watch(model, val => val ? offcanvas.show() : offcanvas.hide())
</script>

<template>
  <div v-offcanvas class="offcanvas-start w-auto" tabindex="-1">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title"></h5>
      <button type="button" class="btn-close" @click="hide" />
    </div>
    <div class="offcanvas-body" @click="hide">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.btn-close {
  position: relative;
  right: 7px;
  /* top: -2px; */
  border-radius: 50%;
}

.btn-close:hover {
  background-color: rgba(0, 0, 0, 0.06);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.06);
}
</style>
