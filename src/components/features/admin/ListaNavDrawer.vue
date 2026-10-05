<script setup>
import { useNavigationAdmin } from '@/composables/useNavigation'
import { useToggle } from 'bootstrap-vue-next'

const { options } = useNavigationAdmin()
const { hide: hideDrawer } = useToggle('drawer-left')
</script>

<template>
  <BListGroup flush class="drawer">
    <BListGroupItem class="title">
      Administrar
    </BListGroupItem>
    <BListGroupItem v-for="{ to, label, icon } in options" :to="to" @click="hideDrawer" class="highlight-active">
      <UIcon :name="icon" />
      {{ label }}
    </BListGroupItem>
  </BListGroup>
</template>