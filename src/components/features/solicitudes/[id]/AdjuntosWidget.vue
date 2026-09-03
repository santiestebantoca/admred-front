<!-- Basic behavour
1. Upload file
   / update uploaded [{key, filename, filesize}]
   / upload file and get it from backend
   / update uploaded [{id, file, filename, filesize}]
2. Delete uploaded file
   / delete uploaded file from backend
   / update uploaded
-->
<script setup>
const uploadedIds = defineModel()  // prueba

import useFileSize from '@/composables/useFileSize.js'
import { useUploadCreate, useUploadDelete } from '@/stores/uploads'
import { ref, watchEffect, useTemplateRef } from 'vue'

const { fileSize } = useFileSize()
const { mutateAsync: crearUpload } = useUploadCreate()
const { mutateAsync: eliminarUpload } = useUploadDelete()
const input = useTemplateRef('input')
const uploaded = ref([])

watchEffect(() => uploadedIds.value = uploaded.value.map(d => d.id).filter(d => d))

const select = () => input.value.click()
// Thunderbird, checks file path... allowing files with same name
const check = name => !uploaded.value.some(v => v.filename === name)

function change({ target }) {
  if (target.files.length) {
    [...target.files].forEach((file) => check(file.name) && submit(file))
  }
}

function submit(file) {
  const data = new FormData()
  data.append('upload', file)
  data.append('filename', file.name)
  data.append('filesize', file.size)
  data.append('filemodified', file.lastModified)
  const pos = uploaded.value.push({ key: Date.now(), filename: file.name, filesize: file.size }) - 1
  crearUpload(data)
    .then((res) => uploaded.value[pos] = res)
    .catch(() => uploaded.value[pos] = { ...uploaded.value[pos], error: true })
}
const del = (id) => eliminarUpload(id)
  .then(() => uploaded.value = uploaded.value.filter(d => d.id !== id))

defineExpose({ select })
// TODO: del(uploaded files) if not submitted
</script>

<template>
  <ul>
    <li v-for="{ id, key, filename, file, filesize, error } in uploaded" :key="id || key" :class="{ error }">
      <BRow class="mx-0">
        <BCol cols="9">
          <a :title="filename" :class="{ error }" :href="file">
            {{ filename }}
          </a>
          <span class="text-nowrap text-muted">
            ({{ fileSize(filesize) }})
          </span>
        </BCol>
        <BCol cols="3" class="position-relative text-end">
          <BButton v-if="id" variant="close" @click.prevent.stop="del(id)" v-tippy="'Quitar adjunto'" />
          <span v-else-if="error" class="text-danger">Error</span>
          <BProgress v-else-if="key" striped :value="100" class="mt-1" />
        </BCol>
      </BRow>
    </li>
  </ul>
  <input type="file" multiple class="d-none" ref="input" @change="change" />
</template>

<style scoped>
ul {
  width: 540px;
  list-style: none;
  padding-left: 0;

  li {
    position: relative;
    background-color: var(--bs-primary-100);
    margin-bottom: 2px;
    border-radius: var(--bs-border-radius-lg);
    padding-top: 5px;
    padding-bottom: 5px;

    &.error {
      background-color: var(--bs-danger-100);
    }

    a {
      text-decoration: none;

      &.error {
        color: var(--bs-secondary);
      }
    }

    .btn-close {
      padding: 6px;
      --bs-btn-font-size: var(--bs-x-small);
      position: absolute;
      top: 0;
      right: 6px;
    }
  }
}
</style>