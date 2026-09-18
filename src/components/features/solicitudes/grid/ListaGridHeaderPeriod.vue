<script setup>
import { PERIODOS } from '@/constants/solicitud'
import { useSolicitudesFiltro } from '@/stores/solicitudes'
import { computed, toRefs } from 'vue';

const { period } = toRefs(useSolicitudesFiltro())
const text = computed(() => PERIODOS.find(d => d.value === period.value)?.text)
</script>

<template>
  <BDropdown :text="text" v-tippy="'Terminadas en el período'" variant="link link-dark border py-1">
    <BDropdownItem v-for="{ text, value } in PERIODOS" @click="period = value">
      {{ text }}
    </BDropdownItem>
  </BDropdown>
</template>