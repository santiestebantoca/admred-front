<script lang="ts" setup>
const props = withDefaults(defineProps<{
  open?: boolean
}>(), {
  open: false,
})
</script>

<template>
  <BButton variant="link wh-26">
    <ILucideChevronDown v-if="open" class="small center" />
    <ILucideChevronRight v-else class="small center" />
  </BButton>
</template>

<style scoped lang="scss">
.btn {
  margin-left: -26px;
  position: relative;
  top: -2px;

  &:not(:hover) {
    color: var(--bs-gray-700);
  }
}
</style>
