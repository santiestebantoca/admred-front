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
  <div>
    <div class="vstack gap-1">
      <div v-for="{ id, key, filename, file, filesize } in uploaded" :key="id || key"
        class="hstack gap-2 px-1 text-bg-light" style="max-width: 540px; height: 34px">
        <a :title="filename" :class="{ disabled: !file }" :href="file"
          class="btn btn-link p-0 text-decoration-none text-truncate" v-text="filename" style="max-width: 75%" />
        <span class="text-nowrap text-muted" v-text="'(' + fileSize(filesize) + ')'" />
        <div class="mx-auto" />
        <div v-if="!id" class="">
          <div class="progress" style="height: 12px; width: 100px">
            <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%" />
          </div>
        </div>
        <bs-btn v-else class="lh-1 p-0" size="24px" flat @click.prevent.stop="del(id)">
          <bs-icon name="x" fs="20px" />
          <bs-tooltip placement="bottom" offset="0,10">Quitar adjunto</bs-tooltip>
        </bs-btn>
      </div>
    </div>
    <input type="file" multiple class="d-none" ref="input" @change="change" />
  </div>
</template>
