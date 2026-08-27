<script setup>
const props = defineProps({ back: Function, cancel: Function, block: Function })

import useSnackbarStore from '@/stores/snackbar'
import useStore from '@/stores/admin-users'
import { ref, computed, inject } from 'vue'

const loading = inject('app:loading')
const snackbar = useSnackbarStore()
const model = ref(true)
const deleted = ref(false)
const store = useStore()
const user = computed(() => store.user.data)
const submit = () => {
  loading.value++
  // store.user.del(user.value.id)
  //   .then(res => process.DELETE(res.data,
  //     () => store.users.get().then(() => {
  //       snackbar.add('Registro eliminado.')
  //       deleted.value = true
  //       model.value = false
  //       loading.value--
  //     }),
  //     () => { }))
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
        Va a eliminar el usuario
        <span class="fw-semibold" v-text="user.name" />.
        Este usuario se puede eliminar de forma segura.
      </p>
      <p>
        Si lo que desea es evitar que el usuario use el sistema por un tiempo,
        puede usar la opción de bloquear su registro, lo cual puede revertir
        en cualquier momento.
      </p>
      <!-- <p>
          ¿Desea continuar?
        </p> -->
      <br>
      <div class="hstack gap-2">
        <bs-btn color="primary" label="Eliminar" @click="submit" />
        <bs-btn color="secondary" label="Bloquear registro" @click="block" />
      </div>
    </bs-dialog-body>
  </bs-dialog>
</template>