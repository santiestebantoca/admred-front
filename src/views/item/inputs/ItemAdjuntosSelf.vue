<!-- Basic behavour
Receive attachment [{id, solicitud_id, upload_id, {...upload}]
1. Delete (lazy)
   / update attchX and attch
2. Sync
   / delete attachment from backend
-->
<script setup>
const props = defineProps(['self'])

import useFileSize from '@/use/useFileSize.js'
import useAttachmentStore from '@/stores/attachment'
import { ref } from 'vue'

const { fileSize } = useFileSize()
const attachment = useAttachmentStore()
const attch = ref(props.self)
const attchX = []

const del = id => {
  attchX.push(id)
  attch.value = attch.value.filter(d => d.id !== id)
}
const sync = async () => await Promise.all(attchX.map(d => attachment.del(d)))

defineExpose({ sync })
</script>

<template>
  <div>
    <div class="vstack gap-1">
      <div v-for="{ id, filename, file, filesize } in attch" :key="id" class="hstack gap-2 px-1 text-bg-light"
        style="max-width: 540px; height: 34px">
        <a :title="filename" :class="{ disabled: !file }" :href="file"
          class="btn btn-link p-0 text-decoration-none text-truncate" v-text="filename" style="max-width: 75%" />
        <span class="text-nowrap text-muted" v-text="'(' + fileSize(filesize) + ')'" />
        <div class="mx-auto" />
        <bs-btn class="lh-1 p-0" size="24px" flat @click.prevent.stop="del(id)">
          <bs-icon name="x" fs="20px" />
          <bs-tooltip placement="bottom" offset="0,10">Quitar adjunto</bs-tooltip>
        </bs-btn>
      </div>
    </div>
  </div>
</template>
