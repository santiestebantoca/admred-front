<script setup>
import Node from './PendingNode.vue'
import useReportStore from '@/stores/report'
import { computed, inject } from 'vue'

const title = inject('page:title')
const report = useReportStore()
const data = computed(() => report.pending.data)
const loading = computed(() => report.pending.loading)
const noData = computed(() => report.pending.noData)
report.pending.get()
title.value = 'Mis pendientes'
</script>

<template>
  <div class="pt-3">
    <p>Solicitudes enviadas por mi área, pendientes.</p>
    <hr />
    <em v-if="loading" class="text-muted">Cargando...</em>
    <em v-else-if="noData" class="text-muted">No hay pendientes</em>
    <div v-else>
      <Node v-for="(d, i) in data" :key="i" :me="d[0]" :data="d" :root="true"
        class="overflow-auto m-0 p-2 border-bottom" />
    </div>
  </div>
</template>
