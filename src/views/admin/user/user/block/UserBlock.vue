<script setup>
const props = defineProps({ back: Function })

import useSnackbarStore from '@/stores/snackbar'
import useStore from '@/stores/admin-users'
import { ref, computed, inject } from 'vue'

const loading = inject('app:loading')
const snackbar = useSnackbarStore()
const model = ref(true)
const store = useStore()
const user = computed(() => store.user.data)
const submit = () => {
  loading.value++
  const data = { registration_key: user.value.blocked ? '' : 'blocked' }
  // store.user.put({ id: user.value.id, data })
  //   .then(res => process.PUT(res.data,
  //     () => Promise.all([
  //       store.users.get(),
  //       store.user.get(user.value.id)
  //     ]).then(() => {
  //       snackbar.add(msg.value[4])
  //       model.value = false
  //       loading.value--
  //     }),
  //     () => { }))
}
const msg = ref(user.value.blocked
  ? ['desbloquear', 'permite', 'Desbloquear', 'Desbloquear registro', 'Registro desbloqueado.']
  : ['bloquear', 'impide', 'Bloquear', 'Bloquear registro', 'Registro bloqueado.']
)
</script>

<template>
  <bs-dialog v-model="model" @hidden="back" fullSmDown>
    <bs-dialog-header :label="msg[3]" />
    <bs-dialog-body>
      <p>
        Va a <span v-text="msg[0]" /> el registro de
        <span class="fw-semibold" v-text="user.name" />.
        Esta acción <span v-text="msg[1]" /> al usuario iniar sesión en el sistema.
      </p>
      <!-- <p>
          ¿Desea continuar?
        </p> -->
      <br>
      <bs-btn color="primary" :label="msg[2]" @click="submit" />
    </bs-dialog-body>
  </bs-dialog>
</template>