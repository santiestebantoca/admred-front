<script setup lang="ts">
const props = defineProps({
  tipoId: Number,
  back: Function,
  backLista: Function
})

import { useTipoDelete } from '@/stores/tipos'
import { useToast } from 'bootstrap-vue-next'
import { computed } from 'vue'

const toast = useToast()
const { mutateAsync: eliminarTipo, asyncStatus } = useTipoDelete()
const loading = computed(() => asyncStatus.value === 'loading')

const submit = () => eliminarTipo(props.tipoId)
  .then(() => {
    toast.create({ body: 'Tipo eliminado.', variant: 'success' })
    props.backLista()
  })
  .catch((err) => {
    toast.create({ body: 'No se pudo ejecutar la acción.', variant: 'danger' })
  })
</script>

<template>
  <div class="max-w-700">
    <h5 class="mb-5">Eliminar tipo</h5>

    <p>
      Esta acción eliminará permanentemente el tipo seleccionado.
    </p>
    <p>
      La acción es segura porque el tipo no está asociada a ninguna operación.
      No obstante, debe tener en cuenta que esta acción no se puede deshacer.
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