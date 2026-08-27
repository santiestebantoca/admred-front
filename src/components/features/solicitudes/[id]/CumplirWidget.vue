<script setup>
const error = defineModel('error')
const value = defineModel('value')
const props = defineProps({
  placement: { type: Boolean, default: 'top-start' }
})

import { Datepicker } from 'vanillajs-datepicker'
import { formatDate } from '@/use/useDates'
import { ref, watch } from 'vue'

const datepicker = ref(null)
const options = ref({
  format: 'yyyy-mm-dd',
  language: 'es'
})
const vPicker = {
  mounted: el => {
    datepicker.value = new Datepicker(el, options.value)
    el.onclick = ({ target }) => {
      if (target.classList.contains('datepicker-cell') && target.classList.contains('day'))
        view.value = 0
    }
  }
}
const view = ref(0)

watch(value, () => error.value = null)

const change = () => value.value = datepicker.value.getDate(options.value.format)
</script>

<template>
  <BDropdown auto-close="outside" no-caret v-tippy="'Fecha de cumplimiento'" variant="footer" :placement="placement"
    @hidden="view = 0">
    <template #button-content>
      <UIcon name="bi-clock" />
      <BBadge v-if="value" dot-indicator variant="warning" class="position-absolute top-0 start-100 translate-middle" />
    </template>
    <template v-if="!view">
      <BDropdownText>
        {{ value ? formatDate(value) : '-' }}
      </BDropdownText>
      <BDropdownDivider />
      <BDropdownItemButton @click="view = 1">
        Establecer fecha de cumplimiento
      </BDropdownItemButton>
    </template>
    <template v-else>
      <div v-picker @changeDate="change" :data-date="value" />
    </template>
  </BDropdown>
</template>
