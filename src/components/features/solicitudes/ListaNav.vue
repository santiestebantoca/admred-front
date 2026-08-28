<script setup>
import { useNavigationSolicitudes } from '@/composables/useNavigation'

const { options } = useNavigationSolicitudes()
const emit = defineEmits(['input'])
</script>

<template>
  <RootTree style="width: 250px;">
    <TreeNode v-for="data in options" :data="data" :key="data.id">
      <template #default="{ data, toggle, open }">
        <BDropdownItem v-if="data.to" :to="data.to" @click="emit('input')" :style="style" class="allow-highlight">
          <UIcon :name="data.icon" />
          <span v-text="data.label" />
          <span v-if="data.count" v-text="data.count" class="ms-auto text-secondary" />
        </BDropdownItem>
        <BDropdownItemButton v-else @click="toggle">
          <TreeItemToggle :open="open" />
          <UIcon :name="data.icon" />
          <span v-text="data.label" />
        </BDropdownItemButton>
      </template>
    </TreeNode>
  </RootTree>
</template>

<style scoped lang="scss">
.btn-x {
  position: absolute;
  top: 5px;
  left: calc(var(--li-padding-left) - 28px) !important;
  padding: 0 4px;
  line-height: normal;

  &:hover {
    background-color: transparent !important;
  }

  >svg {
    position: relative;
    bottom: 2px;
  }
}
</style>