<script lang="ts" setup>
import IndicadorCarga from '@/components/commons/IndicadorCarga.vue'
import { useTiposFiltro, useTiposQuery } from '@/stores/tipos'
import { ref, computed, type PropType } from 'vue'

/** Posición que acepta `BDropdown` (Placement de floating-ui). */
type Placement =
  | 'top' | 'top-start' | 'top-end'
  | 'right' | 'right-start' | 'right-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'

const value = defineModel<number | null>()
const props = defineProps({
  placement: { type: String as PropType<Placement>, default: 'top-start' }
})

// Filtro propio del widget (estado local): no comparte búsqueda ni página con
// la lista del admin.
const { search, filtro } = useTiposFiltro()
const { tipos, isPending, isLoading } = useTiposQuery(filtro)
const sel = computed(() => tipos.value?.find(d => d.id === value.value))
const view = ref(0)
const rootStyle = computed(() => ({
  '--dropdown-menu-width': view.value === 0 ? '272px' : '290px',
  '--dropdown-menu-height': view.value === 0 ? 'auto' : '290px',
}))

const input = (id) => {
  value.value = id
  view.value = 0
}
</script>

<template>
  <BDropdown auto-close="outside" no-caret v-tippy="'Tipo de solicitud'" variant="flat wh-34" :placement="placement"
    :style="rootStyle" @hidden="view = 0">
    <template #button-content>
      <ILucideTag class="center" :class="{ 'text-primary': sel }" />
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
      <BDropdownText v-if="isPending || isLoading">
        <IndicadorCarga inline texto="Cargando tipos…" />
      </BDropdownText>
      <BDropdownItemButton v-for="{ id, nombre } in tipos" :key="id" @click="input(id)">
        {{ nombre }}
      </BDropdownItemButton>
      <BDropdownText v-if="!isPending && !isLoading && !tipos?.length">
        <span class="blockquote-footer"><em>No hay tipos que coincidan.</em></span>
      </BDropdownText>
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