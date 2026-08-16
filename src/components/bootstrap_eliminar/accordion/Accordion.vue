<script setup>
const props = defineProps({ borderless: Boolean })

import { Collapse } from 'bootstrap'
import { ref, getCurrentInstance, provide } from 'vue'

const instance = getCurrentInstance()
const id = ref(`accordion${instance.uid}`)
const shown = ref(null)
provide('accordion:id', id)
provide('accordion:shown', shown)
let accordion
const vAccordion = {
  mounted: el => {
    accordion = new Collapse(el, { toggle: false })
    el.addEventListener('show.bs.collapse', ev => shown.value = ev.target.id)
    el.addEventListener('hide.bs.collapse', ev => (ev.target.id === shown.value) && (shown.value = null))
  },
  unmounted: () => accordion.dispose()
}
</script>

<template>
  <div class="accordion" :id="id" :class="{ borderless }" v-accordion>
    <slot />
  </div>
</template>

<style scoped>
.borderless {
  --bs-accordion-border-width: 0 !important;
}
</style>