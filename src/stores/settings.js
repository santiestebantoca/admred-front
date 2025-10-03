import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

const useFolderStore = defineStore('settings-folder', () => {
  return {}
})

export default defineStore('settings', () => {
  const folder = useFolderStore()
  return { folder }
})
