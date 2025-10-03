<script setup>
import { Datepicker } from 'vanillajs-datepicker'
import { ref } from 'vue'

const es = {
  es: {
    days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
    daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
    months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    today: "Hoy",
    monthsTitle: "Meses",
    clear: "Borrar",
    weekStart: 1,
    format: "dd/mm/yyyy"
  }
}
const dropdown = ref(null)
const display = ref(null)
const emit = defineEmits(['change'])
const change = ev => {
  display.value = Datepicker.formatDate(ev.detail.date, 'MM yyyy', 'es')
  const month = ev.detail.date.getMonth() + 1
  const year = ev.detail.date.getFullYear()
  emit('change', { month, year })
  dropdown.value = false
}
Object.assign(Datepicker.locales, es)
const vPicker = {
  mounted: el => new Datepicker(el, { pickLevel: 1, language: 'es' })
}
</script>

<template>
  <bs-dropdown class="d-inline-block">
    <bs-dropdown-toggle v-model="dropdown" auto="outside">
      <input v-model="display" class="form-control" readonly style="width: 256px" />
    </bs-dropdown-toggle>
    <bs-dropdown-menu>
      <div id="monthPicker" @changeDate="change" v-picker />
    </bs-dropdown-menu>
  </bs-dropdown>
</template>

<style scoped>
input {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-calendar2-check" viewBox="0 0 16 16"><path d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"/><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z"/><path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z"/></svg>');
  background-repeat: no-repeat;
  background-position-x: right 5px;
  background-position-y: 50%;
  cursor: pointer;
}
</style>
