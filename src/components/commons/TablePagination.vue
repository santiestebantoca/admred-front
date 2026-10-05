<script setup>
import { computed, useId } from 'vue'

/**
 * Barra de paginación para tablas paginadas en el servidor.
 *
 * Uso:
 * <TablePagination v-model:page="page" v-model:per-page="limit" :total-rows="total" />
 */
const page = defineModel('page', { type: Number, default: 1 })
const perPage = defineModel('perPage', { type: Number, default: 10 })

const props = defineProps({
  // Total de registros de todas las páginas
  totalRows: { type: Number, default: 0 },
  // Tamaños de página disponibles
  perPageOptions: { type: Array, default: () => [10, 25, 50, 100] },
  // Cantidad máxima de botones de página visibles
  limit: { type: Number, default: 5 },
  disabled: { type: Boolean, default: false },
  // Id del elemento paginado (la tabla)
  ariaControls: { type: String, default: undefined },
})

const perPageId = useId()

// BootstrapVueNext entrega la página como Numberish y el tamaño como Number;
// se normalizan para que los modelos sean siempre números.
const pageModel = computed({
  get: () => page.value,
  set: value => (page.value = Number(value) || 1),
})

const perPageModel = computed({
  get: () => perPage.value,
  set: value => {
    perPage.value = Number(value) || props.perPageOptions[0] || 10
    // Al cambiar el tamaño de página se vuelve a la primera
    page.value = 1
  },
})

const desde = computed(() => (page.value - 1) * perPage.value + 1)
const hasta = computed(() => Math.min(page.value * perPage.value, props.totalRows))
const totalPages = computed(() => Math.ceil(props.totalRows / (perPage.value || 1)) || 1)
const info = computed(() => props.totalRows
  // ? `${desde.value}-${hasta.value} de ${props.totalRows} ${props.totalRows === 1 ? 'registro' : 'registros'}`
  ? `${desde.value}-${hasta.value} de ${props.totalRows}`
  : 'Sin registros')
</script>

<template>
  <div v-if="totalRows" class="table-pagination d-flex flex-wrap align-items-center gap-2 justify-content-end">
    <!-- <div class="d-flex align-items-center gap-2 ms-auto ">
      <label :for="perPageId" class="text-muted small mb-0">Mostrar</label>
      <BFormSelect :id="perPageId" v-model="perPageModel" :options="perPageOptions" :disabled="disabled" size="sm"
        class="table-pagination-per-page" />
      <span class="text-muted small text-nowrap" v-text="info" />
    </div>
    <BPagination v-if="totalPages > 1" v-model="pageModel" :total-rows="totalRows" :per-page="perPage" :limit="limit"
      :disabled="disabled" :aria-controls="ariaControls" aria-label="Paginación" size="sm" pills first-number
      last-number class="ms-auto mb-0" /> -->
    <BDropdown variant="link link-dark" no-caret>
      <template #button-content>
        <span class="text-muted text-nowrap" v-text="info" />
      </template>
      <BDropdownItemButton :disabled="pageModel === 1" @click="pageModel = 1">
        Más nuevas
      </BDropdownItemButton>
      <BDropdownItemButton :disabled="pageModel === totalPages" @click="pageModel = totalPages">
        Más antiguas
      </BDropdownItemButton>
    </BDropdown>
    <BButton variant="link link-dark wh-38" :disabled="pageModel === 1" @click="pageModel--">
      <ILucideChevronLeft class="center" />
    </BButton>
    <BButton variant="link link-dark wh-38" :disabled="pageModel === totalPages" @click="pageModel++">
      <ILucideChevronRight class="center" />
    </BButton>
  </div>
</template>

<style scoped lang="scss">
.btn-link,
:deep(.btn-link) {
  --bs-btn-hover-bg: var(--bs-gray-200);
  --bs-btn-active-bg: var(--bs-gray-200);
}

// .table-pagination {
//   padding-top: .5rem;

//   .table-pagination-per-page {
//     width: auto;
//     min-width: 74px;
//     padding-top: .125rem;
//     padding-bottom: .125rem;
//   }
// }
</style>
