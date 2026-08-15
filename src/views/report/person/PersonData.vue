<script setup>
const props = defineProps(['person'])

import useReportStore from '@/stores/report'
import MonthPicker from '@/components/MonthPicker.vue'
import PersonAsSupervisor from './PersonAsSupervisor.vue'
import PersonAsTramitador from './PersonAsTramitador.vue'
import { onUnmounted, computed } from 'vue'

const report = useReportStore()
const monthPickerChange = period => {
  report.person.solicitudes.reset() // Logic for UI messages
  report.person.solicitudes.get({ user_id: props.person.id, ...period })
}
const loading = computed(() => report.person.solicitudes.loading)
const noData = computed(() => report.person.solicitudes.noData)
onUnmounted(() => report.person.solicitudes.reset())
</script>

<template>
  <div>
    <div class="position-relative text-center pb-3 mb-3 border-bottom">
      <bs-btn @click="$emit('back')" class="position-absolute start-0 px-0 py-4" color="success" flat>
        <bs-icon name="chevron-compact-left" fs="32px" />
      </bs-btn>
      <bs-icon name="person-circle" fs="32px" class="text-success" />
      <h5 class="fw-semibold w-50 text-truncate mx-auto lh-lg" v-text="person.name" />
      <label class="form-label d-block">Período mes/año</label>
      <MonthPicker @change="monthPickerChange" />
    </div>
    <em v-if="loading" class="text-muted">Cargando...</em>
    <em v-else-if="noData" class="text-muted"></em>
    <template v-else>
      <PersonAsSupervisor />
      <br />
      <PersonAsTramitador />
      <br />
      <br />
    </template>
  </div>
</template>