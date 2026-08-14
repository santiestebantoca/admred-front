<script setup>
import FolderTree from '@/components/features/solicitudes/FolderTree.vue'
import { computed, inject } from 'vue'

const params = inject('folder:params')
const mobile = inject('app:mobile')
const icon = computed(() => params.value.tray === 'recibidas' ? 'download' : 'send-fill')
</script>

<template>
  <bs-dropdown :class="{ mobile }">
    <bs-dropdown-toggle>
      <bs-btn class="tab" @click="$emit('showNav')" flat outlined>
        <bs-icon :name="icon" v-if="!mobile" class="me-3" />
        <span class="letter-spacing-1">
          <span class="text-dark text-opacity-75">
            {{ params.tray }}
          </span>
          {{ params.state }}
        </span>
        <bs-btn-caret v-if="!mobile" class="ms-3" />
      </bs-btn>
    </bs-dropdown-toggle>
    <bs-dropdown-menu class="py-3" tag="div" style="width:260px;">
      <FolderTree />
    </bs-dropdown-menu>
  </bs-dropdown>
</template>