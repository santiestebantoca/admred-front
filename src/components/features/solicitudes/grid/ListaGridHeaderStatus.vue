<script setup>
import { PENDIENTE_STATUS } from '@/constants/solicitud'
import { useSolicitudesFiltro } from '@/stores/solicitudes'
import { computed, toRefs } from 'vue';

const { status } = toRefs(useSolicitudesFiltro())
const text = computed(() => PENDIENTE_STATUS.find(d => d.value === status.value).text)
</script>

<template>
  <BDropdown :text="text" v-tippy="'Estado pendiente'" variant="link link-dark border py-1">
    <BDropdownItem v-for="{ text, value } in PENDIENTE_STATUS" @click="status = value">
      {{ text }}
    </BDropdownItem>
  </BDropdown>
</template>