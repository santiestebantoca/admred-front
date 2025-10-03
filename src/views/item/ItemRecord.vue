<script setup>
import useItemStore from '@/stores/item'
import { formatTime } from '@/use/useDates'
import { useRoute } from 'vue-router'
import { ref, computed, onUnmounted } from 'vue'

const item = useItemStore()
const route = useRoute()
const dialog = ref(null)
const data = computed(() => item.record.data)
item.record.get(route.query.item).then(() => dialog.value = true)
onUnmounted(() => item.record.reset())
</script>

<template>
  <bs-dialog v-model="dialog" @hidden="$emit('close')" lg fullSmDown>
    <bs-dialog-header label="Registro" />
    <bs-dialog-body>
      <!-- sm -->
      <div class="d-lg-none">
        <div v-for="r in data" :key="r.id" class="p-1 border-bottom d-flex gap-2 flex-wrap">
          <span v-text="formatTime(r.fecha)" />
          <span v-text="r.by" />
          <span class="fw-semibold" v-text="r.accion" />
          <span class="w-100 text-muted" v-text="r.argumentos" />
        </div>
      </div>
      <!-- lg -->
      <table class=" table table-sm d-none d-lg-block">
        <tbody>
          <tr v-for="r in data" :key="r.id">
            <td class="text-truncate" v-text="formatTime(r.fecha)" />
            <td class="text-truncate" v-text="r.by" />
            <td class="text-truncate fw-semibold" v-text="r.accion" />
            <td class="text-truncate w-100 text-muted" v-text="r.argumentos" />
          </tr>
        </tbody>
      </table>
    </bs-dialog-body>
  </bs-dialog>
</template>

<style scoped>
td {
  padding-left: 8px;
  padding-right: 8px;
}
</style>
