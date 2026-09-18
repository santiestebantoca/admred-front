<script setup>
const error = defineModel('error')
const value = defineModel('value')

import { watch } from 'vue'

watch(value, () => error.value = null)
</script>

<template>
  <div class="vstack gap-1">
    <BFormRadio value="1" v-model="value">
      Aprobar respuesta del tramitador
    </BFormRadio>
    <BFormRadio value="0" v-model="value">
      Desaprobar respuesta del tramitador
    </BFormRadio>
    <div class="small text-danger ps-1" v-text="error"></div>
  </div>
</template>
