<script lang="ts" setup>
const props = withDefaults(defineProps<{
  data: Record<string, unknown>
  level?: number,
}>(), {
  level: 0
})

import { ref, inject, computed, onMounted, onUnmounted, type Ref } from 'vue'

const ids = inject<Ref<Set<string | number>>>('tree:ids', { value: new Set() } as Ref<Set<string | number>>)
const childrenNames = inject<Ref<string[]>>('tree:childrenNames', { value: [] } as Ref<string[]>)
const itemIdName = inject<Ref<string>>('tree:itemIdName', { value: 'id' } as Ref<string>)
const active = inject<Ref<string | number | null>>('tree:active', { value: null } as Ref<string | number | null>)

type ItemId = string | number

const open = ref(Boolean(props.data.open))
const childrenName = computed(() => [...childrenNames.value, 'children'].find(name => Object.prototype.hasOwnProperty.call(props.data, name)) || 'children')
/** Id del nodo actual. */
const itemId = computed<ItemId | undefined>(() => props.data[itemIdName.value] as ItemId | undefined)
/** Hijos del nodo, sea cual sea el nombre configurado para la colección. */
const hijos = computed<Record<string, unknown>[]>(() => {
  const value = props.data[childrenName.value]
  return Array.isArray(value) ? value as Record<string, unknown>[] : []
})
const idDeNodo = (nodo: Record<string, unknown>) => nodo[itemIdName.value] as ItemId | undefined
const leaf = computed(() => !hijos.value.length)
const descendantIds = computed(() => getAllNodeIds(props.data))
const isActive = computed(() => active.value !== null && active.value === props.data[itemIdName.value])
const isDescendantActive = computed(() => active.value !== null && descendantIds.value.some(d => d === active.value))
const ident = computed(() => `${14 * props.level + 32}px`)

onMounted(() => itemId.value !== undefined && ids.value.add(itemId.value))
onUnmounted(() => itemId.value !== undefined && ids.value.delete(itemId.value))

function getAllNodeIds(node: Record<string, unknown>) {
  const ids: ItemId[] = []
  function traverse(n: Record<string, unknown>) {
    const id = idDeNodo(n)
    if (id !== undefined) ids.push(id)
    const children = n[childrenName.value]
    if (Array.isArray(children) && children.length)
      children.forEach((child) => traverse(child as Record<string, unknown>))
  }
  traverse(node)
  return ids.slice(1)
}
const toggle = () => open.value = !open.value
</script>

<template>
  <slot :data="data" :leaf="leaf" :toggle="toggle" :open="open" :ident="ident" :active="active" :isActive="isActive"
    :isDescendantActive="isDescendantActive" :level="level" />
  <template v-if="!leaf">
    <span v-show="open">
      <TreeNode v-for="(child, index) in hijos" :key="idDeNodo(child) || index" :data="child"
        :level="level + 1">
        <template #default="{ data, leaf, toggle, open, ident, active, isActive, isDescendantActive, level }">
          <slot :data="data" :leaf="leaf" :toggle="toggle" :open="open" :ident="ident" :active="active"
            :isActive="isActive" :isDescendantActive="isDescendantActive" :level="level" />
        </template>
      </TreeNode>
    </span>
  </template>
</template>