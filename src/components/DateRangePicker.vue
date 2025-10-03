<!-- 
  v-model on inputs does not work, may be because of rangePicker
 -->

<script setup>
const start = defineModel('start')
const end = defineModel('end')
const error = defineModel('error')

import { DateRangePicker } from 'vanillajs-datepicker'
import { ref, watch, } from 'vue'

const rangePicker = ref(null)
const options = ref({
  format: 'yyyy-mm-dd',
  language: 'es',
  autohide: true,
})
const vPicker = {
  mounted: el => rangePicker.value = new DateRangePicker(el, options.value)
}
const change = () => {
  const dates = rangePicker.value.getDates(options.value.format)
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
  rangePicker.value.setDates(...args)
}
watch([start, end], () => error.value = null)
</script>

<template>
  <div class="hstack gap-1">
    <bs-dropdown>
      <bs-dropdown-toggle>
        <bs-btn flat icon="three-dots-vertical" class="px-1" />
      </bs-dropdown-toggle>
      <bs-dropdown-menu>
        <bs-dropdown-item @click="setRange(1)">Este mes</bs-dropdown-item>
        <bs-dropdown-item @click="setRange(2)">Mes pasado</bs-dropdown-item>
        <bs-dropdown-item @click="setRange(3)">Este año</bs-dropdown-item>
        <bs-dropdown-item @click="setRange(4)">Año pasado</bs-dropdown-item>
      </bs-dropdown-menu>
    </bs-dropdown>
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
