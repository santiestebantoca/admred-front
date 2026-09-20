<script lang="ts" setup>
const props = withDefaults(defineProps<{
  open?: boolean
}>(), {
  open: false,
})
</script>

<template>
  <div class="btn" type="button">
    <ILucideChevronDown v-if="open" class="small" />
    <ILucideChevronRight v-else class="small" />
  </div>
</template>

<style scoped lang="scss">
.btn {
  position: absolute;
  top: 5px;
  left: calc(var(--li-padding-left) - 28px) !important;
  padding: 0 4px;
  line-height: normal;
  color: var(--bs-gray-700);

  &:hover {
    background-color: transparent !important;
    color: var(--bs-primary);
  }

  &:active {
    border-color: transparent !important;
  }

  >svg {
    position: relative;
    top: unset;
    bottom: 1px;
  }
}
</style>
