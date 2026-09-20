<script setup>
const props = defineProps({
  adjuntos: Object,
})

import FileIcon from '@/components/commons/FileIcon.vue'
import useFileSize from '@/composables/useFileSize.js'
import { ref, useId } from 'vue'

const { fileSize } = useFileSize()
const model = ref(undefined)
const collapseId = useId()
</script>

<template>
  <BButton v-b-toggle:[collapseId] variant="link label">
    <ILucideChevronDown v-if="model" />
    <ILucideChevronRight v-else />
    Adjuntos ({{ adjuntos.length }})
  </BButton>
  <BCollapse :id="collapseId" v-model="model">
    <BListGroup horizontal class="gap-2">
      <BListGroupItem v-for="{ id, file, filename, filesize } in adjuntos"
        v-tippy="`${filename} (${fileSize(filesize)})`" :href="file">
        <FileIcon :filename="filename" />
        <span class="text-truncate">{{ filename }}</span>
        <!-- <span class="file-size">
          {{ fileSize(filesize) }}
        </span> -->
      </BListGroupItem>
    </BListGroup>
  </BCollapse>
</template>

<style scoped lang="scss">
.list-group-item {
  display: flex;
  gap: 12px;
  border: 1px solid var(--bs-gray-500) !important;
  border-radius: var(--bs-border-radius-xl) !important;
  width: 200px;

  .file-size {
    // opacity: 0;
    position: absolute;
    height: 26px;
    right: 2px;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(var(--bs-secondary-rgb), .8);
    color: var(--bs-light);
    border-radius: var(--bs-border-radius-xl);
    padding: 0 .5rem;
    transition: all .2s ease-in;
  }

  &:hover {
    .file-size {
      opacity: 1;
    }
  }
}

.btn-link {
  --bs-btn-color: inherit;
  --bs-btn-hover-color: inherit;
  --bs-btn-active-color: inherit;
  padding-left: 0;

  svg {
    color: var(--bs-gray-600);
  }
}
</style>