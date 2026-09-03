<script setup>
import { useNavigationSolicitudes } from '@/composables/useNavigation'
import { useToggle } from 'bootstrap-vue-next'

const { options } = useNavigationSolicitudes()
const { hide: hideDrawer } = useToggle('drawer-left')
</script>

<template>
  <BListGroup flush class="drawer">
    <BListGroupItem class="title">
      Carpetas
    </BListGroupItem>
    <RootTree>
      <TreeNode v-for="data in options" :data="data" :key="data.id">
        <template #default="{ data }">
          <BListGroupItem v-if="data.to" @click="hideDrawer" :to="data.to" class="highlight-active">
            <UIcon :name="data.icon" />
            <span v-text="data.label" />
            <span v-if="data.count" v-text="data.count" class="float-end text-secondary" />
          </BListGroupItem>
          <BListGroupItem v-else class="small">
            {{ data.label }}
          </BListGroupItem>
        </template>
      </TreeNode>
    </RootTree>
  </BListGroup>
</template>