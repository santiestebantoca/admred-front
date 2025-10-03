<script setup>
import { computed } from 'vue'
import useAuthStore from '@/stores/auth'
import useItemStore from '@/stores/item'
const item = useItemStore()
const data = computed(() => item.data)
const items = computed(() => {
  const authUser = useAuthStore().authUser
  const items = []
  if (data.value.padre) {
    const enabled =
      authUser.AR ||
      data.value.padre.origen_id === authUser.area ||
      data.value.padre.destino_id === authUser.area
    items.push({
      relation: '[P]',
      name: data.value.padre.codigo,
      enabled,
      state: data.value.padre.estado,
      to: enabled ? { query: { item: data.value.padre.id } } : ''
    })
  }
  data.value.hijos.forEach(hijo => {
    const enabled =
      authUser.AR ||
      authUser.area === hijo.origen_id ||
      authUser.area === hijo.destino_id
    items.push({
      relation: '[H]',
      name: hijo.codigo,
      enabled,
      state: hijo.estado,
      to: enabled ? { query: { item: hijo.id } } : ''
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
          <router-link :to="item.to" class="text-decoration-none" :class="{ disabled: !item.enabled }">
            {{ item.name }}
          </router-link>
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
