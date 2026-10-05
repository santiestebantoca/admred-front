<script setup>
const props = defineProps({
  linkCrear: Object
})

import Filtro from './ListaFiltro.vue'
import TablePagination from '@/components/commons/TablePagination.vue'
import { useTiposLista } from '@/stores/tipos'
import { computed } from 'vue'

// const mobile = inject('app:mobile')
// Orquesta el estado de la lista (filtros + paginación del servidor) y las
// dos interfaces que lo consumen: Filtro y TablePagination.
const {
  search, nombre, descripcion, isFiltered,
  page, limit, limits,
  tipos, isPending, isLoading, total,
  reset,
} = useTiposLista()
const fields = [
  {
    key: 'nombre',
    label: 'Nombre',
  },
  {
    key: 'descripcion',
    label: 'Descripcion',
  },
]
const tableId = 'admin-tipos-tabla'
const emptyText = computed(() => isFiltered.value
  ? 'No hay tipos que coincidan con los filtros aplicados.'
  : 'Todavía no hay tipos registrados.')
</script>

<template>
  <div class="pt-3 pb-4">
    <BRow class="mb-3 align-items-center">
      <BCol>
        <Filtro v-model:search="search" v-model:nombre="nombre" v-model:descripcion="descripcion" @reset="reset" />
      </BCol>
      <BCol>
        <BButton :to="linkCrear">
          <ILucidePlus /> Agregar
        </BButton>
      </BCol>
    </BRow>
    <TablePagination v-model:page="page" v-model:per-page="limit" :total-rows="total" :per-page-options="limits"
      :disabled="isLoading" :aria-controls="tableId" />
    <BTable :id="tableId" :items="tipos" :fields="fields" :busy="isLoading" :show-empty="!isPending"
      :empty-text="emptyText" hover primary-key="id">
      <template #table-colgroup>
        <col style="width:50%" />
        <col style="width:50%" />
      </template>
      <template #table-busy>
        <div class="py-4 text-center text-muted">
          <BSpinner small /> Cargando tipos...
        </div>
      </template>
    </BTable>
  </div>
</template>

<style scoped lang="scss">
:deep(.b-table) {
  --bvn-sort-icon-none: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%23212529' viewBox='0 0 16 16'%3e%3cpath fill-rule='evenodd' opacity='0.4' d='M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z'/%3e%3c/svg%3e");
  --bvn-sort-icon-asc: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%23212529' viewBox='0 0 16 16'%3e%3cpath fill-rule='evenodd' d='M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z'/%3e%3c/svg%3e");
  --bvn-sort-icon-desc: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%23212529' viewBox='0 0 16 16'%3e%3cpath fill-rule='evenodd' d='M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z'/%3e%3c/svg%3e");
  --bs-table-hover-bg: rgba(var(--bs-surface-5-rgb), .3);

  thead {
    th {
      font-size: .875em;
      font-weight: 600;
      line-height: 24px;
    }
  }

  tbody {
    tr {
      cursor: pointer;
    }

    td {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: var(--td-white-space);
      transition: background-color .15s;
    }
  }
}
</style>