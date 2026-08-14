<script setup>
import AppsWidget from '@/views/app/widgets/apps/Collapse.vue'
import UserWidget from '@/views/app/widgets/user/Dialog.vue'
import FolderTree from './base/FolderTree.vue'
</script>

<template>
  <div class="h-100 d-flex flex-column bg-light-1 overflow-auto gap-1 pb-4">
    <!-- <bs-btn-close v-if="down" @click="$emit('hide')" class="m-1 ms-auto" /> -->
    <div class="px-3 fw-semibold d-flex align-items-center" style="height:48px">Solicitudes</div>
    <div class="border-bottom" />
    <div class="px-1 py-2">
      <FolderTree drawer @hide="$emit('hide')" />
    </div>
    <div class="m-auto" />
    <div class="border-bottom" />
    <AppsWidget class="px-1" />
    <div class="border-bottom" />
    <UserWidget class="px-1" />
  </div>
</template>

<style scoped>
.link {
  color: var(--bs-primary);
  text-align: start;
  width: 100%;
}
</style>