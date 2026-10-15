<script setup lang="ts">
const props = defineProps({
  usuarioId: Number,
  back: Function,
  backLista: Function
})

import { useUsuarioDelete } from '@/stores/usuarios'
import { useToast } from 'bootstrap-vue-next'
import { computed } from 'vue'

const toast = useToast()
const { mutateAsync: eliminarUsuario, asyncStatus } = useUsuarioDelete()
const loading = computed(() => asyncStatus.value === 'loading')

const submit = () => eliminarUsuario(props.usuarioId)
  .then(() => {
    toast.create({ body: 'Usuario eliminado.', variant: 'success' })
    props.backLista()
  })
  .catch((err) => {
    toast.create({ body: 'No se pudo ejecutar la acción.', variant: 'danger' })
  })
</script>

<template>
  <div class="max-w-700">
    <div class="hstack gap-2 mb-4 h-38">
      <BButton @click="back" variant="flat wh-34 ms-n2">
        <ILucideArrowLeft class="center" />
      </BButton>
      <h5 class="mb-1">Eliminar usuario</h5>
    </div>
    <p>
      Se eliminará el usuario permanentemente.
    </p>
    <p class="fw-semibold">
      Esta acción no se puede deshacer.
    </p>
    <BFormButtons class="py-4">
      <BButton variant="secondary" @click="back">
        Cancelar
      </BButton>
      <BButton variant="danger" @click="submit" :loading="loading" loading-fill class="w-90">
        Eliminar
      </BButton>
    </BFormButtons>
  </div>
</template>