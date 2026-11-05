<script setup>
const props = defineProps({
  areaId: Number,
  back: Function,
  backLista: Function
})

import { useAreaDelete } from '@/stores/areas'
import { useNotificaciones } from '@/composables/useNotificaciones'
import { computed } from 'vue'

const { exito, errorDeApi } = useNotificaciones()
const { mutateAsync: eliminarArea, asyncStatus } = useAreaDelete()
const loading = computed(() => asyncStatus.value === 'loading')

const submit = () => eliminarArea(props.areaId)
  .then(() => {
    exito('Área eliminada.')
    props.backLista()
  })
  .catch((err) => {
    errorDeApi(err, 'No se pudo ejecutar la acción.')
  })
</script>

<template>
  <div class="max-w-700 px-3">
    <h5 class="mb-5">Eliminar área</h5>

    <p>
      Se eliminará el área permanentemente.
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