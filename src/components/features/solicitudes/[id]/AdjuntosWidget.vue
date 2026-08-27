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
const uploaded = ref([])

import useHandleSubmit from '@/use/useHandleSubmit.js'
import useFileSize from '@/use/useFileSize.js'
import useUploadStore from '@/stores/upload'
import { ref } from 'vue'

const process = useHandleSubmit()
const { fileSize } = useFileSize()
const upload = useUploadStore()

const input = ref(null)
const select = () => input.value.click()
const ids = () => uploaded.value.map(d => d.id).filter(d => d)
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
  upload.post(data)
    .then(res => {
      if (res.data.id)
        upload.get(res.data.id).then(res => uploaded.value[pos] = res.data)
      else delete uploaded.value[pos]
    })
}
const del = async id => await upload
  .del(id)
  .then(res => process.DELETE(res.data, () =>
    uploaded.value = uploaded.value.filter(d => d.id !== id)
  ))

defineExpose({ select, ids })
// TODO: del(uploaded files) if not submitted
</script>

<template>
  <ul>
    <li v-for="{ id, key, filename, file, filesize } in uploaded" :key="id || key">
      <BRow class="mx-0">
        <BCol cols="10">
          <a :title="filename" :class="{ disabled: !file }" :href="file">
            {{ filename }}
          </a>
          <span class="text-nowrap text-muted">
            ({{ fileSize(filesize) }})
          </span>
        </BCol>
        <BCol cols="2">
          <BProgress v-if="!id" striped :value="100" />
          <BButton v-else @click.prevent.stop="del(id)" v-tippy="'Quitar adjunto'" class="btn-eliminar" variant="link">
            <UIcon name="bi-x" />
          </BButton>
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
    height: 34px;
    position: relative;
    background-color: var(--bs-primary-100);
    margin-bottom: 2px;
    border-radius: var(--bs-border-radius-lg);
    padding-top: 5px;

    a {
      text-decoration: none;
    }

    .btn-eliminar {
      margin-left: auto;
      width: 30px;
      height: 30px;
      position: absolute;
      top: 2px;
      right: 4px;
      --bs-btn-hover-bg: var(--bs-primary-200);
      --bs-btn-active-bg: var(--bs-primary-200);

      &>svg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>