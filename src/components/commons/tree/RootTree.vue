<script lang="ts" setup>
const active = defineModel<string | number | null>()
const props = withDefaults(defineProps<{
  childrenNames?: string[]
  itemIdName?: string,
}>(), {
  childrenNames: () => [] as string[],
  itemIdName: 'id',
})

import { provide, toRef, ref, watchEffect, onMounted, onUnmounted, type Ref } from 'vue'

const ids = ref(new Set<string | number>())
const handleNodeClick = (id: string | number) => active.value = id
const mounted = ref(false)

provide('tree:ids', ids) // Todos los ids actualizados por cada TreeNode al motarse y desmontarse
provide('tree:active', active)
provide('tree:onNodeClick', handleNodeClick)
provide('tree:childrenNames', toRef(props, 'childrenNames'))
provide('tree:itemIdName', toRef(props, 'itemIdName'))

watchEffect(() => {
  if (mounted.value) { // Sino hace active = null mientras se genera el Set ids
    if (!ids.value.has(active.value as string | number)) active.value = null
  }
})

onMounted(() => mounted.value = true)
onUnmounted(() => active.value = null)
</script>

<template>
  <ul class="m-0 p-0 list-unstyled">
    <slot></slot>
  </ul>
</template>