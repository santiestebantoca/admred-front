<script setup>
import useReportStore from '@/stores/report'
import { ref, computed, watch, inject } from 'vue'

const title = inject('page:title')
const report = useReportStore()
const codigo = ref(null)
const data = computed(() => report.buscar.data)
const disabled = computed(() => !codigo.value)
watch(codigo, () => report.buscar.reset())
const submit = () => report.buscar.get(codigo.value)
report.buscar.reset()
title.value = 'Buscar código'
</script>

<template>
  <div class="pt-3">
    <p>
      Buscar solicitud por su código (las 10 primeras coincidencias).
    </p>
    <div class="my-3 py-3 border-top border-bottom">
      <form @submit.prevent="submit">
        <div class="d-flex flex-wrap gap-3">
          <div style="width: 160px">
            <!-- <label class="form-label">No. solicitud</label> -->
            <input v-model="codigo" type="text" class="form-control" placeholder="Código" />
          </div>
          <div class="hstack align-items-end">
            <bs-btn @click="submit" :disabled="disabled" color="primary" label="Buscar" />
          </div>
        </div>
      </form>
    </div>
    <div v-if="data">
      <div v-if="data.length" class="hstack gap-3 flex-wrap">
        <template v-for="d in data">
          <bs-btn color="primary" flat :to="{ query: { item: d.id } }" v-text="d.codigo" />
        </template>
      </div>
      <div v-else>
        Código <span class="fw-bold" v-text="codigo" /> no encontrado.
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-label {
  font-weight: 600;
  font-size: .875em;
}
</style>