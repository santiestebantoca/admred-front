<script setup>
import PersonData from './PersonData.vue'
import useReportStore from '@/stores/report'
import { ref, computed, inject } from 'vue'

const title = inject('page:title')
const report = useReportStore()
const selected = ref(null)
const data = computed(() => report.person.data)
report.person.get()
title.value = 'Desempeño personal'
</script>

<template>
  <div class="pt-3">
    <p>
      Desempeño sobre las solicitudes terminadas en el período y las solicitudes pendientes.
    </p>
    <div class="border-top mb-3" />
    <PersonData v-if="selected" :person="selected" @back="selected = null" />
    <div v-else class="ms-0 p-0">
      <table class="table align-middle table-hover w-auto table-borderless">
        <tbody>
          <tr v-for="_ in data" :key="_.id" role="button" @click="selected = _">
            <td class="py-0">
              <bs-icon name="person-circle" fs="24px" class="text-success" />
            </td>
            <td class="pe-lg-4">{{ _.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>