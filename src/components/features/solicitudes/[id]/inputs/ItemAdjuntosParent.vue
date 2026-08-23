<!-- Basic behavour
Receive attachment [{id, solicitud_id, upload_id, {...upload}]
1. Delete
   / update attachment
2. ids
   / :: attachment ids
-->
<script setup>
const props = defineProps(['parent'])

import useFileSize from '@/use/useFileSize.js'
import { ref } from 'vue'

const { fileSize } = useFileSize()
const attch = ref(props.parent)

const del = id => attch.value = attch.value.filter(d => d.id !== id)
const ids = () => attch.value.map(d => d.upload_id)

defineExpose({ ids })
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
