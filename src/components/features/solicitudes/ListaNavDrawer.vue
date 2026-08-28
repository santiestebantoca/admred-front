<script setup>
const props = defineProps({ close: Function })

import { useNavigationSolicitudes } from '@/composables/useNavigation'

const { options } = useNavigationSolicitudes()
</script>

<template>
  <BListGroup flush class="drawer">
    <BListGroupItem class="title">
      Carpetas
    </BListGroupItem>
    <RootTree>
      <TreeNode v-for="data in options" :data="data" :key="data.id">
        <template #default="{ data }">
          <BListGroupItem v-if="data.to" @click="close" :to="data.to" :style="style">
            <UIcon :name="data.icon" />
            <span v-text="data.label" class="mx-2" />
            <span v-if="data.count" v-text="data.count" class="float-end text-secondary" />
          </BListGroupItem>
          <BListGroupItem v-else>
            <UIcon name="bi-file" />
            <span v-text="data.label" />
          </BListGroupItem>
        </template>
      </TreeNode>
    </RootTree>
  </BListGroup>


</template>

<style scoped lang="scss">
.drawer {
  --bs-list-group-border-width: 0 !important;
  --bs-list-group-border-color: transparent !important;

  .list-group-item {
    color: var(--bs-dark);
    border-radius: var(--bs-border-radius-xl);

    &.title {
      font-size: .875em;
      color: var(--bs-secondary);
      font-weight: 600;
    }

    svg {
      position: relative;
      top: -2px;
      width: 1rem;
      height: 1rem;
    }
  }
}

.router-link-active {
  background-color: var(--bs-surface-4);
}
</style>