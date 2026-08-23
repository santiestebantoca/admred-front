<script setup>
import { useRouter } from 'vue-router'
import { ref, watch, computed, inject } from 'vue'

const query = inject('solicitudes:query')
const params = inject('solicitudes:params')
const router = useRouter()
const search = computed({
  get: () => query.value.search,
  set(search) {
    router.push({
      query: {
        ...query.value,
        search,
        ...search
          ? {
            search_in: [
              'objetivo',
              params.value.tray === 'recibidas'
                ? 'origen'
                : 'destino']
          }
          : {}
      }
    })
  }
})
</script>

<template>
  <BSearchInput searchIcon v-model="search" lazy class="rounded-3" />
</template>

<style scoped>
:deep([type="search"]) {
  padding-top: .25rem;
  padding-bottom: .25rem;
}
</style>