<script setup>
const props = defineProps({ closeDropdown: Function })

import { useNavigationSolicitudes } from '@/composables/useNavigation'

const { options } = useNavigationSolicitudes()
</script>

<template>
  <RootTree style="width: 270px;">
    <TreeNode v-for="data in options" :data="data" :key="data.id">
      <template #default="{ data, toggle, open, ident }">
        <BDropdownItem v-if="data.to" :to="data.to" @click="closeDropdown" class="highlight-active"
          :style="{ paddingLeft: ident }">
          <UIcon :name="data.icon" />
          {{ data.label }}
          <span v-if="data.count" v-text="data.count" class="float-end text-secondary" />
        </BDropdownItem>
        <BDropdownItemButton v-else @click="toggle" :style="{ paddingLeft: ident }">
          <TreeItemToggle :open="open" />
          {{ data.label }}
        </BDropdownItemButton>
      </template>
    </TreeNode>
  </RootTree>
</template>