<script setup>
const model = defineModel()
const props = defineProps({
  auto: { type: String, default: 'true' },
  icon: Boolean
})

import { Dropdown } from 'bootstrap'
import { watch } from 'vue'

const emit = defineEmits(['hidden', 'shown'])
let dropdown
const vDropdown = {
  mounted: el => {
    props.icon && el.classList.add('dropdown-toggle')
    dropdown = new Dropdown(el)
    model.value ? dropdown.show() : dropdown.hide()
    el.addEventListener('hidden.bs.dropdown', () => {
      emit('hidden')
      model.value = false
      document.querySelector('body').classList.remove('no-interaction')
    })
    el.addEventListener('shown.bs.dropdown', () => {
      emit('shown')
      model.value = true
      document.querySelector('body').classList.add('no-interaction')
    })
  },
  unmounted: () => {
    dropdown.dispose()
    document.querySelector('body').classList.remove('no-interaction')
  }
}
watch(model, val => val ? dropdown.show() : dropdown.hide())
</script>

<template>
  <div data-bs-toggle="dropdown" :data-bs-auto-close="auto" aria-expanded="false" v-dropdown>
    <slot />
  </div>
</template>
