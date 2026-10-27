<script setup>
const props = defineProps({
  areaId: Number,
  back: Function,
  backLista: Function
})

import { useAreaDelete } from '@/stores/areas'
import { useToast } from 'bootstrap-vue-next'
import { computed } from 'vue'

const toast = useToast()
const { mutateAsync: eliminarArea, asyncStatus } = useAreaDelete()
const loading = computed(() => asyncStatus.value === 'loading')

const submit = () => eliminarArea(props.areaId)
  .then(() => {
    toast.create({ body: 'Área eliminada.', variant: 'success' })
    props.backLista()
  })
  .catch((err) => {
    toast.create({ body: 'No se pudo ejecutar la acción.', variant: 'danger' })
  })
</script>

<template>
  <div class="max-w-700">
    <h5 class="mb-5">Eliminar área</h5>

    <p>
      Se eliminará el área permanentemente.
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