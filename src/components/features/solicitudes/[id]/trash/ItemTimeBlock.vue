<script setup>
import useItemStore from '@/stores/item'
import { formatTime } from '@/composables/useDates'
import { ref, computed } from 'vue'

const item = useItemStore()
const all = ref(false)
const data = computed(() => item.data)
const timeList = computed(() => {
  if (!data.value) return []
  const timeList = []
  timeList.push({
    title: 'Presentada',
    value: formatTime(data.value.solicitado_en)
  })
  if (data.value.tramitador_en && all.value)
    timeList.push({
      title: 'Asignada',
      value: formatTime(data.value.tramitador_en)
    })
  if (data.value.respuesta_en && all.value)
    timeList.push({
      title: 'Respondida',
      value: formatTime(data.value.respuesta_en)
    })
  if (data.value.terminado_en)
    timeList.push({
      title: 'Terminada',
      value: formatTime(data.value.terminado_en)
    })
  timeList.push({
    title: 'Acum. N (L)',
    value: data.value.acumulado + ' (' + data.value.laborable + ')',
    subtotal: true
  })
  return timeList
})
</script>

<template>
  <bs-table xs separator="none">
    <template #tbody>
      <tr v-for="item in timeList" :key="item.title" :class="{ 'fw-semibold': item.subtotal }">
        <td v-text="item.title" class="text-dark ps-0" />
        <td v-text="item.value" class="text-dark" />
      </tr>
      <tr v-if="(data.estado.id > 1) && !all">
        <td>
          <bs-badge rounded color="info" type="button" @click="all = true" label="MÁS" />
        </td>
      </tr>
    </template>
  </bs-table>
</template>
