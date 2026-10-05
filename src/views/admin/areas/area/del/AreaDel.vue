<script setup>
const props = defineProps({ back: Function, cancel: Function })

import useSnackbarStore from '@/stores/snackbar'
import useStore from '@/stores/admin-areas'
import { ref, computed, inject } from 'vue'

const loading = inject('app:loading')
const snackbar = useSnackbarStore()
const model = ref(true)
const deleted = ref(false)
const store = useStore()
const area = computed(() => store.area.data)
const submit = () => {
  loading.value++
  // store.area.del(area.value.id)
  // .then(res => process.DELETE(res.data,
  //   () => store.areas.get().then(() => {
  //     snackbar.add('Registro eliminado.')
  //     deleted.value = true
  //     model.value = false
  //     loading.value--
  //   }),
  //   () => { }))
}
const backIf = () => {
  if (deleted.value) props.back()
  else props.cancel()
}
</script>

<template>
  <bs-dialog v-model="model" @hidden="backIf" fullSmDown>
    <bs-dialog-header label="Eliminar registro" />
    <bs-dialog-body>
      <p>
        Va a eliminar el área
        <span class="fw-semibold" v-text="area.nombre" />.
        Esta área se puede eliminar de forma segura.
      </p>
      <!-- <p>
          ¿Desea continuar?
        </p> -->
      <br>
      <div class="hstack gap-2">
        <bs-btn color="primary" label="Eliminar" @click="submit" />
      </div>
    </bs-dialog-body>
  </bs-dialog>
</template>