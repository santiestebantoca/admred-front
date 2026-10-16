<script setup>
import { PENDIENTE_STATUS } from '@/constants'
import { useSolicitudesFiltro } from '@/stores/solicitudes'
import { computed, toRefs } from 'vue';

const { status } = toRefs(useSolicitudesFiltro())
const text = computed(() => PENDIENTE_STATUS.find(d => d.value === status.value).text)
</script>

<template>
  <BDropdown v-tippy="'Estado pendiente'" variant="link link-dark fw-semibold border h-36 py-1">
    <template #button-content>
      <ILucideScan class="ms-n1 fs-09" />
      {{ text }}
    </template>
    <BDropdownItem v-for="{ text, value } in PENDIENTE_STATUS" @click="status = value">
      {{ text }}
    </BDropdownItem>
  </BDropdown>
</template>