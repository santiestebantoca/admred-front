<script lang="ts" setup>
const props = defineProps({
  areaId: Number,
  back: Function,
  backLista: Function
})

import BotonEnvio from '@/components/commons/BotonEnvio.vue'
import { useAreaDelete } from '@/stores/areas'
import { useNotificaciones } from '@/composables/useNotificaciones'
import { computed } from 'vue'

const { exito, errorDeApi } = useNotificaciones()
const { mutateAsync: eliminarArea, asyncStatus } = useAreaDelete()
const loading = computed(() => asyncStatus.value === 'loading')

const submit = () => {
  if (loading.value) return
  eliminarArea(props.areaId)
    .then(() => {
      exito('Área eliminada.')
      props.backLista()
    })
    .catch((err) => {
      errorDeApi(err, 'No se pudo ejecutar la acción.')
    })
}
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
      <BButton variant="emphasis" :disabled="loading" @click="back()">
        Cancelar
      </BButton>
      <BotonEnvio variant="danger" class="w-90" :loading="loading" loading-fill texto-cargando="Eliminando…"
        @click="submit">
        Eliminar
      </BotonEnvio>
    </BFormButtons>
  </div>
</template>