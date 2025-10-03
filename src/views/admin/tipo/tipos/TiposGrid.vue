<script setup>
import useStore from '@/stores/admin-tipos'
import { ref, computed, inject } from 'vue'

const mobile = inject('app:mobile')
const store = useStore().tipos
const selected = ref(null)
const data = computed(() => store.data)
const ths = computed(() => (
  [
    {
      title: 'Nombre',
    },
    {
      title: 'Descripción',
    }
  ]
))
const rows = computed(() =>
  data.value.map(r => ({
    id: r.id,
    click: () => select(r.id),
    cls: { 'table-light': r.id === selected.value },
    cols: [
      { text: r.nombre, cls: 'bold text-truncate' },
      { text: r.descripcion, cls: 'text-truncate' || '-' },
    ]
  })
  ))
const emit = defineEmits(['rowClick', 'new'])
const select = id => {
  selected.value = id
  emit('rowClick', id)
}
// Pagination
const pagination = computed(() => store.page.text)
const btnDown = computed(() => ({
  action: () => {
    store.page.prev()
    store.get()
  },
  disable: store.page.prevDisabled
}))
const btnUp = computed(() => ({
  action: () => {
    store.page.next()
    store.get()
  },
  disable: store.page.nextDisabled
}))
</script>

<template>
  <div class="data-box data-box-fluid">
    <!-- Add button / Pagination -->
    <div class="hstack justify-content-between">
      <!-- Add button -->
      <bs-btn-icon v-if="mobile" @click="$emit('new')" icon="plus-lg" color="primary" />
      <bs-btn v-else @click="$emit('new')" icon="plus-lg" color="primary" isize="14" label="Nuevo registro" outline
        rounded flat />
      <!-- Pagination -->
      <div class="hstack">
        <span class="small text-muted ms-auto me-2" v-text="pagination" />
        <bs-btn-pg-down :disable="btnDown.disable" @click="btnDown.action()" flat />
        <bs-btn-pg-up :disable="btnUp.disable" @click="btnUp.action()" flat />
      </div>
    </div>
    <!-- Table -->
    <div v-if="mobile" class="py-2 bg-light-1 rounded-4 mx-n2">
      <div class="p-2 mx-2 border-bottom" v-for="row in rows" :key="row.id" :class="row.cls" @click="row.click"
        type="button">
        <div class="text-truncate">
          <span v-text="row.cols[0].text" />
        </div>
        <div class="text-truncate text-muted small">
          <span v-text="row.cols[1].text" />
        </div>
      </div>
    </div>
    <div v-else>
      <bs-table stickyHeader>
        <template #colgroup>
          <!-- <col style="width:40%" />
          <col style="width:30%" />
          <col style="width:30%" /> -->
        </template>
        <template #thead>
          <tr>
            <bs-table-th v-for="th in ths" :key="th.title" :label="th.title" />
          </tr>
        </template>
        <template #tbody>
          <tr v-for="row in rows" :key="row.id" :class="row.cls" @click="row.click" type="button">
            <td v-for="col, i in row.cols" :key="i" :class="col.cls" :title="col.text" v-text="col.text" />
          </tr>
        </template>
      </bs-table>
    </div>
  </div>
</template>
