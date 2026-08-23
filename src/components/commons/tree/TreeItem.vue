<script lang="ts" setup>
const open = defineModel<boolean>('open')

const props = withDefaults(defineProps<{
  treeItemId: string | number
  // groupTitle: boolean | undefined
  leaf?: boolean
  level?: number
  descendantActive?: boolean,
  // to?: object
}>(), {
  level: 0,
})

import { computed, inject, type Ref } from 'vue'

// const selectable = inject<Ref<boolean>>('tree:selectable', { value: false } as Ref<boolean>)
// const active = inject<Ref<string | number | null>>('tree:active', { value: null } as Ref<string | number | null>)
const list = inject<Ref<boolean>>('tree:list', { value: false } as Ref<boolean>)
// const isActive = computed(() => selectable.value && active.value !== null && props.treeItemId === active.value)
const rootStyle = computed(() => ({
  '--li-padding-left': list.value ? '8px' : `${14 * (props.level || 0) + 32}px`,
  ...props.descendantActive && !open.value ? { '--li-bg-color': 'var(--bs-gray-100)' } : {}
}))

// const onNodeClick = inject<(id: string | number) => void>('tree:onNodeClick', () => { })
// const handleClick = () => {
//   onNodeClick(props.treeItemId)
// }
</script>

<template>
  <span :style="rootStyle">
    <slot></slot>
  </span>
</template>

<style scoped lang="scss">
:deep(.dropdown-item) {
  padding-left: var(--li-padding-left) !important;
  position: relative;
}
</style>
