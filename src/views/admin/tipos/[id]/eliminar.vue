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
    <div class="hstack gap-2 mb-4 h-38">
      <BButton @click="back" variant="flat wh-34 ms-n2">
        <ILucideArrowLeft class="center" />
      </BButton>
      <h5 class="mb-1">Eliminar tipo</h5>
    </div>
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