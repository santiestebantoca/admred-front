<!-- 
  v-model on inputs does not work, may be because of rangePicker
 -->

<script lang="ts" setup>
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
  <div class="hstack gap-1">
    <BDropdown>
      <template #button-content>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
          class="bi bi-three-dots-vertical mb-1" viewBox="0 0 16 16">
          <path
            d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
        </svg>
      </template>
      <BDropdownItem @click="setRange(1)">Este mes</BDropdownItem>
      <BDropdownItem @click="setRange(2)">Mes pasado</BDropdownItem>
      <BDropdownItem @click="setRange(3)">Este año</BDropdownItem>
      <BDropdownItem @click="setRange(4)">Año pasado</BDropdownItem>
    </BDropdown>
    <div class="hstack gap-3" v-picker @changeDate="change">
      <input class="form-control" placeholder="Fecha de inicio" />
      <input class="form-control" placeholder="Fecha final" />
    </div>
  </div>
</template>

<style scoped>
.form-control {
  max-width: 132px;
}
</style>
