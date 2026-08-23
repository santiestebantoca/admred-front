<script setup>
const error = defineModel('error')
const value = defineModel('value')
const props = defineProps({ down: Boolean })

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
        carousel.value = 0
    }
  }
}
const change = () => value.value = datepicker.value.getDate(options.value.format)
watch(value, () => error.value = null)
const carousel = ref(0)
</script>

<template>
  <bs-dropdown :up="!down">
    <bs-dropdown-toggle auto="outside" @hidden="carousel = 0">
      <bs-btn-icon flat icon="clock" style="font-size:20px">
        <bs-badge v-if="value" floating inset color="primary" />
        <bs-tooltip placement="top" offset="0,10">Fecha de cumplimiento</bs-tooltip>
      </bs-btn-icon>
    </bs-dropdown-toggle>
    <bs-dropdown-menu>
      <bs-carousel v-model="carousel">
        <bs-carousel-item>
          <li v-if="value">
            <label class="form-label px-3">Fecha de cumplimiento</label>
            <div class="px-3 py-1" v-text="formatDate(value)" />
            <hr class="dropdown-divider opacity-50" style="min-width: 240px" />
          </li>
          <li>
            <a class="dropdown-item" type="button" @click="carousel = 1"> Establecer fecha de cumplimiento </a>
          </li>
        </bs-carousel-item>
        <bs-carousel-item>
          <div v-picker @changeDate="change" :data-date="value" />
        </bs-carousel-item>
      </bs-carousel>
    </bs-dropdown-menu>
  </bs-dropdown>
</template>
