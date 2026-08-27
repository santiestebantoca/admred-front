<script setup>
const error = defineModel('error')
const value = defineModel('value')
const props = defineProps({
  placement: { type: String, default: 'top-start' }
})

import BSearchInput from '@/components/commons/bootstrap-vue-next/BSearchInput.vue'
import { useTiposQuery } from '@/stores/tipos'
import { ref, computed, watch } from 'vue'

const { tipos, isPending, search } = useTiposQuery()
const sel = computed(() => tipos.value?.find(d => d.id === value.value))
const view = ref(0)
const rootStyle = computed(() => ({
  '--dropdown-menu-width': view.value === 0 ? '272px' : '290px',
  '--dropdown-menu-height': view.value === 0 ? 'auto' : '290px',
}))

watch(value, () => error.value = null)

const input = (id) => {
  value.value = id
  view.value = 0
}
</script>

<template>
  <BDropdown auto-close="outside" no-caret v-tippy="'Tipo de solicitud'" variant="footer" :placement="placement"
    :style="rootStyle" @hidden="view = 0">
    <template #button-content>
      <UIcon name="bi-tag" />
      <BBadge v-if="sel" dot-indicator variant="warning" class="position-absolute top-0 start-100 translate-middle" />
    </template>
    <template v-if="!view">
      <BDropdownText>
        {{ sel ? sel.nombre : '-' }}
      </BDropdownText>
      <BDropdownDivider />
      <BDropdownItemButton @click="view = 1">
        Marcar solicitud como
      </BDropdownItemButton>
    </template>
    <template v-else>
      <BDropdownText>
        <BSearchInput searchIcon v-model="search" class="rounded-4" />
      </BDropdownText>
      <BDropdownItemButton v-for="{ id, nombre } in tipos" :key="id" @click="input(id)">
        {{ nombre }}
      </BDropdownItemButton>
    </template>
  </BDropdown>
</template>

<style scoped>
:deep(.dropdown-menu) {
  width: var(--dropdown-menu-width);
  height: var(--dropdown-menu-height);
  overflow-y: auto;


  button {
    white-space: normal !important;
    word-wrap: break-word !important;
    height: auto !important;
  }
}
</style>