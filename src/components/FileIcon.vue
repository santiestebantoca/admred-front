<script setup>
// Inspired by https://drive.google.com
// Images from https://drive-thirdparty.googleusercontent.com/32/type/[MIME Type]
// MIME Type from https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
import { computed } from 'vue'
const props = defineProps({
  filename: String
})
const types = {
  // images
  bmp: 'image',
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  // documents
  pdf: 'pdf',
  doc: 'word',
  docx: 'word',
  odt: 'word',
  xls: 'excel',
  xlsx: 'excel',
  xlsm: 'excel',
  csv: 'excel',
  ods: 'excel',
  ppt: 'ppt',
  pptx: 'ppt',
  txt: 'plain',
  rtf: 'plain',
  html: 'plain',
  htm: 'plain',
  xhtml: 'plain',
  xml: 'plain',
  // archives
  zip: 'zip',
  rar: 'zip',
  msg: 'message',
  eml: 'message',
}
const ext = computed(() => props.filename.includes('.') && props.filename.split('.').pop().toLowerCase())
const i = computed(() => {
  const type = types[ext.value] || 'plain'
  const _ = {}
  _[type] = true
  return _
})
</script>

<template>
  <span>
    <!-- excel -->
    <img v-if="i.excel" src="@/assets/mime/vnd.oasis.opendocument.spreadsheet.png">
    <!-- pdf -->
    <img v-if="i.pdf" src="@/assets/mime/pdf.png">
    <!-- ppt -->
    <img v-if="i.ppt" src="@/assets/mime/vnd.oasis.opendocument.presentation.png">
    <!-- plain -->
    <img v-if="i.plain" src="@/assets/mime/plain.png">
    <!-- word -->
    <img v-if="i.word" src="@/assets/mime/msword.png">
    <!-- zip -->
    <img v-if="i.zip" src="@/assets/mime/gzip.png">
    <!-- image -->
    <img v-if="i.image" src="@/assets/mime/png.png">
    <!-- mail -->
    <img v-if="i.message" src="@/assets/mime/message.png">
  </span>
</template>

<style scoped>
span {
  line-height: 1.3rem
}

img {
  width: 20px;
  height: 20px;
}
</style>
