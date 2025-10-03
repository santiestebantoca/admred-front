<script setup>
const props = defineProps({ drawer: Boolean })

import useFolderStore from '@/stores/folder'
import { ref, computed } from 'vue'

const folder = useFolderStore()
folder.pending.get()
const items = computed(() => {
  const { incoming, outgoing } = folder.pending.data
  return [
    {
      label: 'Recibidas',
      action: 'download',
      items: [
        {
          label: 'Pendientes',
          count: incoming,
          to: { params: { tray: 'recibidas', state: 'pendientes' } }
        },
        {
          label: 'Terminadas',
          to: { params: { tray: 'recibidas', state: 'terminadas' } }
        }
      ]
    },
    {
      label: 'Enviadas',
      action: 'send-fill',
      items: [
        {
          label: 'Pendientes',
          count: outgoing,
          to: { params: { tray: 'enviadas', state: 'pendientes' } }
        },
        {
          label: 'Terminadas',
          to: { params: { tray: 'enviadas', state: 'terminadas' } }
        }
      ]
    }
  ]
}, { immediate: true })
const tree = ref({})
const vCollapse = {
  mounted: (el, binding) => {
    tree.value[binding.arg] = true
    el.onclick = ev => {
      ev.stopPropagation()
      tree.value[binding.arg] = !tree.value[binding.arg]
    }
  }
}
</script>

<template>
  <div>
    <div v-for="item in items" :key="item.label">
      <div v-collapse:[item.label] type="button" :class="[drawer ? 'btn' : 'dropdown-item']">
        <bs-icon :name="item.action" />
        <span v-text="item.label" />
        <span v-text="item.collapse" />
      </div>
      <div v-if="tree[item.label]">
        <router-link v-for="child in item.items" :key="child.label" :to="child.to"
          :class="[drawer ? 'btn' : 'dropdown-item']" @click="$emit('hide')">
          <span />
          <bs-icon name="files-alt" fs="1rem" class="text-muted" />
          <span v-text="child.label" />
          <span class="ms-auto text-secondary fw-normal" v-text="child.count" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown-item {
  gap: 1em;
}

.btn {
  display: flex;
  gap: .5rem;
  position: relative;
}

.btn:active {
  border-color: transparent !important;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: inherit;
  background-color: currentColor;
  opacity: 0;
  transition: .2s;
}

.btn:hover::before {
  opacity: .075;
}

.btn.router-link-active::before {
  opacity: .1;
}
</style>