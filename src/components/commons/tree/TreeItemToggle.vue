<script lang="ts" setup>
const props = withDefaults(defineProps<{
  open?: boolean
}>(), {
  open: false,
})
</script>

<template>
  <BButton variant="link wh-26 tree-item-toggle">
    <ILucideChevronDown v-if="open" class="small center" />
    <ILucideChevronRight v-else class="small center" />
  </BButton>
</template>

<style scoped lang="scss">
.btn {
  margin-left: -26px;
  margin-top: -4px;
  margin-bottom: -4px;
  position: relative;
  top: -1px;

  &:not(:hover) {
    color: var(--bs-gray-700);
  }
}
</style>
