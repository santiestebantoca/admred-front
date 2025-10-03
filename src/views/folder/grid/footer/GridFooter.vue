<script setup>
import useFolderStore from '@/stores/folder'
import { formatHM } from '@/use/useDates'
import { ref, watch, onBeforeUnmount } from 'vue'

const folder = useFolderStore()
const outdated = ref(null)
const checkOutdated = () => (Date.now() - (folder.status.updated || Date.now())) > 300000
const interval = setInterval(() => outdated.value = checkOutdated(), 10000)
watch(() => folder.status.updated, () => outdated.value = false)
onBeforeUnmount(() => clearInterval(interval))
// const detalles = () => { }
const actualizar = () => {
  folder.get()
  folder.pending.get()
}
// UX

</script>

<template>
  <div style="height: 50px">
    <div class="text-body-secondary hstack small px-4 gap-3 h-100">
      <div style="min-width:130px">
        <bs-btn @click="actualizar" flat size="sm" color="primary">
          <span class="fw-semibold text-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
              class="bi bi-arrow-repeat" viewBox="0 0 16 16" style="position:relative;top:-1px;left:-1px">
              <path
                d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9" />
              <path fill-rule="evenodd"
                d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z" />
            </svg>
            Actualizado: <span v-text="formatHM(folder.status.updated)" :class="{ outdated }" />
          </span>
          <bs-tooltip placement="top" offset="0,10">Actualizar </bs-tooltip>
        </bs-btn>
      </div>
      <div class="mx-auto" />
      <div class="fw-semibold hstack my-auto gap-2">
        Elementos encontrados: <span v-text="folder.page.total" />
        <transition name="flash">
          <span v-if="folder.searchBy.search" class="text-danger">(búsqueda aplicada)</span>
        </transition>
      </div>
      <div class="px-1" />
    </div>
  </div>
</template>

<style scoped>
.outdated {
  color: var(--bs-danger);
}

.hover:hover {
  background-color: rgba(var(--bs-success-rgb), .1);
  transition: .2s;
}
</style>
