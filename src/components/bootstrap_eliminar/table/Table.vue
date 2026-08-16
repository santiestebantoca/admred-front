<script setup>
const props = defineProps({
  stickyHeader: Boolean,
  trHeight: { type: String, default: '42px' },
  variant: { type: [String, Number], default: '1' },
  separator: { type: String, default: 'horizontal' }, // vertical, cell, none
  sm: Boolean,
  xs: Boolean,
  hover: Boolean,
})
const vTable = el => {
  if (props.stickyHeader) el.classList.add('table-sticky')
  if (props.sm) el.classList.add('table-sm')
  if (props.xs) el.classList.add('table-xs')
  if (props.hover) el.classList.add('table-hover')
  el.classList.add('table-border-' + props.separator.toLowerCase())
  el.classList.add(`variant-${props.variant}`)
}
</script>

<template>
  <table class="table" v-table>
    <colgroup>
      <slot name="colgroup" />
    </colgroup>
    <thead>
      <slot name="thead" />
    </thead>
    <tbody>
      <slot name="tbody" />
    </tbody>
  </table>
</template>

<style scoped>
/* thead th sticky */

.table-sticky {
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
}

.table-sticky :deep(thead th) {
  position: sticky;
  top: 0;
  z-index: 10;
}

/* table styles */

.table-xs :deep(th),
.table-xs :deep(td) {
  padding: 2px 4px;
}

.variant-1 {
  --table-th-td-height: v-bind(stickyHeader ? trHeight : 'unset');
  --table-thead-th-height: var(--table-th-td-height);
  --table-thead-th-color: var(--bs-table-color);
  --table-thead-th-background: white;
  --table-thead-th-border-bottom: solid 1px #c7c9c9;
  --table-thead-th-font-size: 14px;
  --table-thead-th-font-weight: 600;
  --table-tbody-td-height: var(--table-th-td-height);
  --table-tbody-td-color: var(--bs-secondary-color);
  --table-tbody-td-bold-color: #1f1f1f;
  --table-tbody-td-bold-font-weight: normal;
  --table-tbody-td-border-bottom: none;
  --table-tbody-td-box-shadow: inset 0 -1px 0 0 rgba(100, 121, 143, 0.122);
  --table-tbody-td-user-select: none;
  --table-tbody-tr-hover-background: transparent;
}

.variant-1.table-hover {
  --table-tbody-tr-hover-background: #f9fafb;
}

.variant-1.table-border-none {
  --table-tbody-td-box-shadow: none;
}

:deep(thead th) {
  height: var(--table-thead-th-height);
  color: var(--table-thead-th-color);
  background: var(--table-thead-th-background);
  border-bottom: var(--table-thead-th-border-bottom);
  font-size: var(--table-thead-th-font-size);
  font-weight: var(--table-thead-th-font-weight);
}

:deep(tbody td) {
  height: var(--table-tbody-td-height);
  color: var(--table-tbody-td-color);
  border-bottom: var(--table-tbody-td-border-bottom);
  box-shadow: var(--table-tbody-td-box-shadow);
  user-select: var(--table-tbody-td-user-select);
}

:deep(tbody td.bold) {
  color: var(--table-tbody-td-bold-color);
  font-weight: var(--table-tbody-td-bold-font-weight);
}

:deep(tbody tr:hover) {
  background: var(--table-tbody-tr-hover-background);
}
</style>