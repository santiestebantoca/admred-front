<script setup>
import { computed } from 'vue'
import useItemStore from '@/stores/item'
const item = useItemStore()
const data = computed(() => item.data)
const items = computed(() => {
  const items = []
  if (data.value.padre) {
    items.push({
      relation: '[P]',
      name: data.value.padre.codigo,
      state: data.value.padre.estado,
      to: { query: { item: data.value.padre.id } }
    })
  }
  data.value.hijos.forEach(hijo => {
    items.push({
      relation: '[H]',
      name: hijo.codigo,
      state: hijo.estado,
      to: { query: { item: hijo.id } }
    })
  })
  return items
})
</script>

<template>
  <bs-table xs separator="none">
    <template #tbody>
      <tr v-for="item in items" :key="item.name">
        <td v-text="item.relation" class="text-dark" />
        <td>
          <router-link :to="item.to" class="text-decoration-none" v-text="item.name" />
        </td>
        <td v-text="item.state" class="text-dark" />
      </tr>
    </template>
  </bs-table>
</template>

<style scoped>
.disabled {
  color: rgba(var(--bs-link-color-rgb), 0.75);
  pointer-events: none;
}
</style>
