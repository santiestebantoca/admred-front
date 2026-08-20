<script lang="ts" setup>
const props = withDefaults(defineProps<{
  data: Record<string, any>
  level?: number,
  open?: boolean
}>(), {
  level: 0
})

import { ref, inject, computed, onMounted, onUnmounted, type Ref } from 'vue'

const ids = inject<Ref<Set<string | number>>>('tree:ids', { value: new Set() } as Ref<Set<string | number>>)
const list = inject<Ref<boolean>>('tree:list', { value: false } as Ref<boolean>)
const childrenNames = inject<Ref<string[]>>('tree:childrenNames', { value: [] } as Ref<string[]>)
const itemIdName = inject<Ref<string>>('tree:itemIdName', { value: 'id' } as Ref<string>)
const active = inject<Ref<string | number | null>>('tree:active', { value: null } as Ref<string | number | null>)
const open = ref(props.open)
const childrenName = computed(() => [...childrenNames.value, 'children'].find(name => Object.prototype.hasOwnProperty.call(props.data, name)) || 'children')
const leaf = computed(() => !props.data[childrenName.value]?.length)
const descendantIds = computed(() => getAllNodeIds(props.data))
const isDescendantActive = computed(() => active.value !== null && descendantIds.value.some(d => d === active.value))

onMounted(() => ids.value.add(props.data[itemIdName.value]))
onUnmounted(() => ids.value.delete(props.data[itemIdName.value]))

function getAllNodeIds(node: Record<string, any>) {
  const ids: Array<string | number> = []
  function traverse(node: Record<string, any>) {
    if (node[itemIdName.value] !== undefined) ids.push(node[itemIdName.value])
    if (node[childrenName.value] && node[childrenName.value].length)
      node[childrenName.value].forEach((child: Record<string, any>) => traverse(child))
  }
  traverse(node)
  return ids.slice(1)
}
</script>

<template>
  <TreeItem v-model="open" :level="level" :leaf="leaf" :treeItemId="data[itemIdName]"
    :descendantActive="isDescendantActive" :open="open">
    <slot :data="data" :leaf="leaf" />
  </TreeItem>
  <template v-if="!list && !leaf && childrenName">
    <span v-show="open">
      <TreeNode v-for="(child, index) in data[childrenName]" :key="child[itemIdName] || index" :data="child"
        :level="level + 1">
        <template #default="{ data, leaf }">
          <slot :data="data" :leaf="leaf" />
        </template>
      </TreeNode>
    </span>
  </template>
</template>