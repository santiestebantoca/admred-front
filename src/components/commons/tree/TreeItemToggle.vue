<script lang="ts" setup>
const props = withDefaults(defineProps<{
  open?: boolean
}>(), {
  open: false,
})
</script>

<template>
  <div class="btn" type="button">
    <UIcon v-if="open" name="bi-chevron-down" font-size="12px" />
    <UIcon v-else name="bi-chevron-right" font-size="12px" />
  </div>
</template>

<style scoped lang="scss">
.btn {
  position: absolute;
  top: 5px;
  left: calc(var(--li-padding-left) - 28px) !important;
  padding: 0 4px;
  line-height: normal;

  &:hover {
    background-color: transparent !important;
    color: var(--bs-primary);
  }

  &:active {
    border-color: transparent !important;
  }

  >svg {
    position: relative;
    bottom: 2px;
  }
}
</style>
