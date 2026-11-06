<script lang="ts" setup>
import Filtro from './ListaFiltro.vue'
import IndicadorCarga from '@/components/commons/IndicadorCarga.vue'
import TablaEsqueleto from '@/components/commons/TablaEsqueleto.vue'
import TablePagination from '@/components/commons/TablePagination.vue'
import { useUsuariosLista } from '@/stores/usuarios'
import { useSelectedItems } from '@/composables/useSelectedItems'
import type { UsuarioListaItem } from '@/types/api'
import type { TableFieldRaw } from 'bootstrap-vue-next'
import type { RouteLocationRaw } from 'vue-router'
import { ref, computed, inject, watchEffect, type Ref } from 'vue'

const usuarioId = inject<Ref<number | undefined>>('admin:usuarios:usuarioId')
const linkCrear = inject<RouteLocationRaw>('admin:usuarios:linkCrear')
const setUsuarioId = inject<Ref<(usuarioId: number) => void>>('admin:usuarios:setUsuarioId')
const active = ref<number[]>([])
const selectedItems = useSelectedItems<UsuarioListaItem>(active, (ids) => ids.length && setUsuarioId.value(ids[0]))
// Orquesta el estado de la lista (filtros + paginación del servidor) y las
// dos interfaces que lo consumen: Filtro y TablePagination.
const {
  search, nombre, area, rol, estado, isFiltered,
  page, limit, limits,
  usuarios, isPending, isLoading, total,
  reset,
} = useUsuariosLista()
const fields: TableFieldRaw<UsuarioListaItem>[] = [
  {
    key: 'name',
    label: 'Nombre',
  },
  {
    key: 'username',
    label: 'Nombre de usuario',
  },
  {
    key: 'registration_key',
    label: 'Clave de registro',
    formatter: ({ value }) => value === 'blocked'
      ? 'Bloqueado'
      : String(value || 'Activo')
  },
]
const tableId = 'admin-usuarios-tabla'
const emptyText = computed(() => isFiltered.value
  ? 'No hay usuarios que coincidan con los filtros aplicados.'
  : 'Todavía no hay usuarios registrados.')

watchEffect(() => usuarioId.value && (active.value = [usuarioId.value]))
</script>

<template>
  <div>
    <div class="hstack align-items-center mb-3 max-w-700">
      <div class="col-8">
        <Filtro v-model:search="search" v-model:nombre="nombre" v-model:area="area" v-model:rol="rol"
          v-model:estado="estado" @reset="reset" />
      </div>
      <BButton :to="linkCrear" class="ms-auto">
        <ILucidePlus /> Agregar
      </BButton>
    </div>
    <TablePagination v-model:page="page" v-model:per-page="limit" :total-rows="total" :per-page-options="limits"
      :disabled="isLoading" :aria-controls="tableId" />
    <div class="position-relative" :aria-busy="isLoading">
      <div v-if="isLoading && !isPending" class="indicador-actualizacion">
        <IndicadorCarga inline texto="Actualizando…" />
      </div>
      <TablaEsqueleto v-if="isPending" :columnas="fields.length" :filas="6" texto="Cargando usuarios…" />
      <BTable v-else :id="tableId" :items="usuarios" :fields="fields" :empty-text="emptyText" show-empty hover
        primary-key="id" selectable select-mode="single" v-model:selected-items="selectedItems">
        <template #table-colgroup>
          <col style="width:40%" />
          <col style="width:40%" />
        </template>
      </BTable>
    </div>
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