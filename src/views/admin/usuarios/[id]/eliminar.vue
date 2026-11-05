<script setup lang="ts">
const props = defineProps({
  usuarioId: Number,
  back: Function,
  backLista: Function
})

import { useUsuarioDelete } from '@/stores/usuarios'
import { useNotificaciones } from '@/composables/useNotificaciones'
import { computed } from 'vue'

const { exito, errorDeApi } = useNotificaciones()
const { mutateAsync: eliminarUsuario, asyncStatus } = useUsuarioDelete()
const loading = computed(() => asyncStatus.value === 'loading')

const submit = () => eliminarUsuario(props.usuarioId)
  .then(() => {
    exito('Usuario eliminado.')
    props.backLista()
  })
  .catch((err) => {
    errorDeApi(err, 'No se pudo ejecutar la acción.')
  })
</script>

<template>
  <div class="max-w-700 px-3">
    <h5 class="mb-5">Eliminar usuario</h5>

    <p>
      Se eliminará el usuario permanentemente.
    </p>
    <p class="text-danger fw-semibold">
      Esta acción no se puede deshacer.
    </p>
    <BFormButtons class="py-4">
      <BButton variant="emphasis" @click="back">
        Cancelar
      </BButton>
      <BButton variant="danger" @click="submit" :loading="loading" loading-fill class="w-90">
        Eliminar
      </BButton>
    </BFormButtons>
  </div>
</template>