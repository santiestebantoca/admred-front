<script setup>
import FileIcon from '@/components/FileIcon.vue'
import useFileSize from '@/use/useFileSize.js'
import useItemStore from '@/stores/item'
import { computed } from 'vue'

const { fileSize } = useFileSize()
const item = useItemStore()
const adjuntos = computed(() => item.data.adjuntos_solicitud)
</script>

<template>
  <div>
    <bs-btn v-for="{ id, file, filename, filesize } in adjuntos" :key="id" :title="filename" :href="file" flat
      class="w-100 fs-6" size="sm">
      <div class="hstack gap-2">
        <FileIcon :filename="filename" />
        <span class="text-truncate" v-text="filename" />
        <span class="text-nowrap opacity-75 mx-1" v-text="fileSize(filesize)" />
      </div>
    </bs-btn>
  </div>
</template>