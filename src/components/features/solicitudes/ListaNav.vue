<script setup>
const props = defineProps({ closeDropdown: Function })

import { useNavigationSolicitudes } from '@/composables/useNavigation'

const { options } = useNavigationSolicitudes()
</script>

<template>
  <RootTree style="width: 270px;">
    <TreeNode v-for="data in options" :data="data" :key="data.id">
      <template #default="{ data, toggle, open }">
        <BDropdownItem v-if="data.to" :to="data.to" @click="closeDropdown" class="highlight-active">
          <UIcon :name="data.icon" />
          <span v-text="data.label" />
          <span v-if="data.count" v-text="data.count" class="float-end text-secondary" />
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