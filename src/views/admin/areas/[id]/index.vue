<script setup lang="ts">
const props = defineProps({
  showDetalle: Boolean,
  areaId: Number,
  back: Object,
  editar: Object,
  eliminar: Object,
})

import { formatTime } from '@/composables/useDates'
import { useAreaQuery } from '@/stores/areas'

const { area, isPending } = useAreaQuery(props.areaId)
</script>

<template>
  <div v-show="showDetalle" class="max-w-700">
    <div class="hstack gap-2 mb-4">
      <BButton :to="back" variant="flat wh-34 ms-n2">
        <ILucideArrowLeft class="center" />
      </BButton>
      <h5 class="mb-1">Detalles del registro</h5>
      <template v-if="!isPending">
        <BButton :to="editar" variant="flat ms-auto">
          <ILucidePenLine /> Editar
        </BButton>
        <BButton v-if="area.permisos.eliminar" :to="eliminar" variant="flat">
          <ILucideTrash /> Eliminar
        </BButton>
      </template>
    </div>
    <div v-if="isPending" class="py-5 text-center">
      <BSpinner />
    </div>
    <div v-else class="vstack gap-4 mb-4">
      <div class="w-100">
        <label class="form-label">Nombre</label>
        <div>
          {{ area.nombre }}
        </div>
      </div>
      <div class="w-100">
        <label class="form-label">Nivel</label>
        <div>
          {{ area.nivel?.nombre }}
        </div>
      </div>
      <div class="w-100">
        <label class="form-label">Pertenece al área</label>
        <div>
          {{ area.padre?.nombre || '-' }}
        </div>
      </div>
      <template v-if="area.modified_by">
        <div class="pt-3 border-top">
          <label class="form-label">Modificado</label>
          <div>
            {{ area.modified_by }},
            {{ formatTime(area.modified_on) }}
          </div>
        </div>
      </template>
    </div>
  </div>
  <router-view />
</template>