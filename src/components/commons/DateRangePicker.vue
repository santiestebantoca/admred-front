<!-- 
  v-model on inputs does not work, may be because of rangePicker
 -->

<script lang="ts" setup>
const props = defineProps({
  required: Boolean
})

const start = defineModel<Date | null>('start')
const end = defineModel<Date | null>('end')
const error = defineModel<string | null>('error')

import { DateRangePicker } from 'vanillajs-datepicker'
import { ref, watch } from 'vue'

const rangePicker = ref<DateRangePicker | null>(null)
const options = ref({
  format: 'yyyy-mm-dd',
  language: 'es',
  autohide: true,
})
const vPicker = {
  mounted: el => rangePicker.value = new DateRangePicker(el, options.value)
}
const change = () => {
  const dates = rangePicker.value?.getDates(options.value.format) || []
  start.value = dates[0]
  end.value = dates[1]
}
const setRange = val => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() // 0 base
  let args
  if (val === 1) args = [new Date(year, month, 1), date]
  if (val === 2) args = [new Date(year, month - 1, 1), new Date(year, month, 0)]
  if (val === 3) args = [new Date(year, 0, 1), date]
  if (val === 4) args = [new Date(year - 1, 0, 1), new Date(year, 0, 0)]
  rangePicker.value?.setDates(...(args as [Date, Date]))
}

watch([start, end], () => error.value = null)
</script>

<template>
  <div class="hstack gap-2">
    <BDropdown no-caret variant="emphasis wh-38">
      <template #button-content>
        <IBiThreeDotsVertical class="center" />
      </template>
      <BDropdownItem @click="setRange(1)">Este mes</BDropdownItem>
      <BDropdownItem @click="setRange(2)">Mes pasado</BDropdownItem>
      <BDropdownItem @click="setRange(3)">Este año</BDropdownItem>
      <BDropdownItem @click="setRange(4)">Año pasado</BDropdownItem>
    </BDropdown>
    <div class="hstack gap-2" v-picker @changeDate="change">
      <BFormInput placeholder="Fecha inicial" :required="props.required" />
      <BFormInput placeholder="Fecha final" :required="props.required" />
    </div>
  </div>
</template>

<style scoped>
.form-control {
  max-width: 140px;
}
</style>
