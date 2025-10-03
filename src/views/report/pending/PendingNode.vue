<script setup>
const props = defineProps(['me', 'data', 'root'])

import Node from './PendingNode.vue'
import useAuthStore from '@/stores/auth'
import { computed } from 'vue'

const terminado = computed(() => props.me.estado === 4)
const enabled = computed(() => props.root || useAuthStore().authUser.AR)
</script>

<template>
  <div class="row flex-nowrap">
    <div class="col-auto">
      <router-link class="btn-link" :to="{ query: { item: me.id } }" :event="enabled ? 'click' : ''"
        :class="{ terminado }" style="line-height: 32px; padding: 3px 8px">
        {{ me.codigo }}
      </router-link>
    </div>
    <div class="col-auto" v-if="me.children.length">
      <Node v-for="id in me.children" :key="id" :me="data.find((_) => _.id === id)" :data="data" />
    </div>
  </div>
</template>

<style scoped>
.btn-link:hover {
  --bs-opacity: .4;
}

.btn-link {
  --bs-opacity: .2;
  --bs-color-rgb: var(--bs-warning-rgb);
  background: rgba(var(--bs-color-rgb), var(--bs-opacity));
  border: solid 1px rgba(var(--bs-color-rgb), 1);
  color: var(--bs-dark);
  border-radius: 3px;
  transition: .2s;
  text-decoration: none;
  padding: 1px 5px !important;
}

.btn-link.terminado {
  --bs-color-rgb: var(--bs-info-rgb);
}
</style>