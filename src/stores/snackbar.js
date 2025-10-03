import { ref } from 'vue'
import { defineStore } from 'pinia'

export default defineStore('snackbar', () => {
  const data = ref([])
  function add(_data) {
    data.value.push({
      ...(typeof _data == "string")
        ? { text: _data }
        : { text: _data.text, color: _data.color, icon: _data.icon },
      timestamp: new Date().valueOf()
    })
  }
  const del = ts => data.value = data.value.filter(d => d.timestamp !== ts)
  return { data, add, del }
})
