<!-- 
React to route.query.item
(setted by someone else and removed by ItemView)
if item: get data then show ItemView
else: hide ItemView the set data to null
-->
<script setup>
import ItemView from './index.vue'
import useItemStore from '@/stores/item'
import { useRoute } from 'vue-router'
import { computed, watchEffect, inject } from 'vue'

const loading = inject('app:loading')
const route = useRoute()
const item = useItemStore()
const id = computed(() => route.query.item)
watchEffect(() => {
  if (id.value) {
    loading.value = true
    item.get(id.value).then(() => loading.value = false)
  }
})
const leave = () => item.reset()
</script>

<template>
  <Teleport to="body">
    <transition @after-leave="leave">
      <ItemView class="fixed" v-if="id && item.data" />
    </transition>
  </Teleport>
</template>

<style scoped>
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1035;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: var(--bs-surface-1);
}

@media(min-width:1200px) {
  .fixed {
    overflow-y: hidden;
  }
}

.v-enter-active {
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.v-enter-from {
  opacity: 0;
  transform: translateX(-15px);
}

.v-leave-active {
  transition: 0.2s;
}

.v-leave-to {
  opacity: 0;
  transform: translateX(-400px);
}
</style>
