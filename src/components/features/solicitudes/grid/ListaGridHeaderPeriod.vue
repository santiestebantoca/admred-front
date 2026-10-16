<script setup>
import { PERIODOS } from '@/constants'
import { useSolicitudesFiltro } from '@/stores/solicitudes'
import { computed, toRefs } from 'vue';

const { period } = toRefs(useSolicitudesFiltro())
const text = computed(() => PERIODOS.find(d => d.value === period.value)?.text)
</script>

<template>
  <BDropdown v-tippy="'Terminadas en el período'" variant="link link-dark fw-semibold border h-36 py-1">
    <template #button-content>
      <ILucideRotateCcw class="ms-n1 fs-09" />
      {{ text }}
    </template>
    <BDropdownItem v-for="{ text, value } in PERIODOS" @click="period = value">
      {{ text }}
    </BDropdownItem>
  </BDropdown>
</template>