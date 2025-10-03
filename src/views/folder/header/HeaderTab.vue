<script setup>
import FolderTree from '../base/FolderTree.vue'
import { computed, inject } from 'vue'

const params = inject('folder:params')
const mobile = inject('app:mobile')
const icon = computed(() => params.value.tray === 'recibidas' ? 'download' : 'send-fill')
</script>

<template>
  <bs-dropdown :class="{ mobile }">
    <bs-dropdown-toggle>
      <bs-btn class="tab" @click="$emit('showNav')" flat sactive square size="50px">
        <bs-icon :name="icon" fs="18px" v-if="!mobile" class="me-3" />
        <span class="tab-label pe-1">
          <span v-text="params.tray + ' '" />
          <span class="fw-semibold" v-text="params.state" />
        </span>
        <bs-btn-caret v-if="!mobile" class="ms-3" />
      </bs-btn>
    </bs-dropdown-toggle>
    <bs-dropdown-menu class="py-3" tag="div" style="width:260px;">
      <FolderTree />
    </bs-dropdown-menu>
  </bs-dropdown>
</template>

<style scoped>
.tab {
  --tab-padding-x: 16px;
  --tab-padding-y: 0px;
  --letter-spacing: .01rem;
  padding: var(--tab-padding-y) var(--tab-padding-x);
  position: relative;
  background-color: var(--gg-light-2);
}

.mobile .tab {
  --letter-spacing: normal;
  --tab-padding-x: 8px;
}

.tab-label {
  letter-spacing: var(--letter-spacing);
}

.tab::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 2px;
  height: 2px;
  background-color: rgba(var(--bs-primary-rgb), .9);
  right: 2px;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
}
</style>