<script setup>
import { computed } from 'vue'

const props = defineProps({
  border: Boolean,
  start: Boolean,
  center: Boolean
})
const vDialogFooter = el => {
  if (!props.border) el.classList.add('border-0')
}
// CSS
const justifyContent = computed(() => props.start ? 'start' : (props.center ? 'center' : 'end'))
</script>

<template>
  <div class="modal-footer" v-dialog-footer>
    <slot />
  </div>
</template>

<style scoped>
.modal-footer {
  justify-content: v-bind(justifyContent);
}
</style>
