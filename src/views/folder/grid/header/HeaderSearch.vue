<script setup>
import useFolderStore from '@/stores/folder'
import { ref, watch, computed, inject } from 'vue'

const params = inject('folder:params')
const folder = useFolderStore()
const value = ref(null)
const headers = ref(['objetivo'])
const dropdown = ref(null)
const applied = computed(() => !!folder.searchBy.search)
watch(() => folder.searchBy.search, val => value.value = val)
//
const submit = () => {
  if (value.value) {
    folder.searchBy = { search: value.value, headers: headers.value.join(',') }
    folder.get()
    dropdown.value = null
  } else reset(applied.value)
}
const reset = (reload = true) => {
  value.value = dropdown.value = folder.searchBy.search = null
  reload && folder.get()
}
const placeholder = computed(() => folder.searchBy.search || 'Buscar en la lista')
</script>

<template>
  <bs-dropdown class="position-relative" style="pointer-events: auto;">
    <bs-btn-icon flat size="34px" @click="submit" class="left bg-search" />
    <bs-btn-icon v-if="applied" icon="x" flat size="34px" @click="reset" class="right" style="font-size: 1.3rem;" />
    <bs-dropdown-toggle auto="outside" v-model="dropdown">
      <form @submit.prevent="submit">
        <input class="form-control" v-model="value" :placeholder="placeholder" />
      </form>
    </bs-dropdown-toggle>
    <bs-dropdown-menu class="p-3 w-100">
      <bs-switch value="objetivo" label="Objetivo" v-model="headers" />
      <template v-if="params.tray === 'recibidas'" v-model="headers">
        <bs-switch value="origen" label="Demandante" v-model="headers" />
      </template>
      <bs-switch v-else value="destino" label="Área consultada" v-model="headers" />
      <bs-switch value="codigo" label="Código" v-model="headers" />
    </bs-dropdown-menu>
  </bs-dropdown>
</template>

<style scoped>
.left {
  position: absolute;
  top: 2px;
  left: 3px;
}

.right {
  position: absolute;
  top: 2px;
  right: 3px;
}

.bg-search {
  background-image: url("@/assets/images/search.svg");
  background-repeat: no-repeat;
  background-position: 8px 10px;
}

.form-control {
  padding-left: 40px;
  padding-right: 40px;
  border-radius: 50rem;
  width: 340px;
}
</style>