<script setup>
import FileIcon from '@/components/FileIcon.vue'
import useFileSize from '@/use/useFileSize.js'
import useItemStore from '@/stores/item'
import { computed } from 'vue'

const { fileSize } = useFileSize()
const item = useItemStore()
const adjuntos = computed(() => item.data.adjuntos_respuesta)
</script>

<template>
  <div>
    <a v-for="{ id, file, filename, filesize } in adjuntos" :key="id" :title="filename" :href="file">
      <FileIcon :filename="filename" />
      <span class="text-truncate" v-text="filename" />
      <span class="text-nowrap opacity-75 mx-1" v-text="fileSize(filesize)" />
    </a>
  </div>
</template>

<style scoped>
a {
  text-decoration: none;
  display: flex;
  height: 35px;
  align-items: center;
  gap: 16px;
  padding: 0 8px;
  color: var(--bs-gray-800);
}

a:hover {
  background-color: var(--bs-gray-200);
}
</style>
