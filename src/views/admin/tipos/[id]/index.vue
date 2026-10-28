<script setup lang="ts">
const props = defineProps({
  showDetalle: Boolean,
  tipoId: Number,
  back: Object,
  editar: Object,
  eliminar: Object,
})

import { formatTime } from '@/composables/useDates'
import { useTipoQuery } from '@/stores/tipos'
import { provide } from 'vue';

const { tipo, isPending } = useTipoQuery(props.tipoId)
provide('tipo:tipo', tipo)
</script>

<template>
  <div v-show="showDetalle" class="max-w-700">
    <div class="hstack gap-2 mb-5">
      <BButton :to="back" variant="flat wh-34 ms-n2">
        <ILucideArrowLeft class="center" />
      </BButton>
      <h5 class="mb-1">Detalles del tipo</h5>
      <template v-if="!isPending">
        <BButton :to="editar" variant="flat ms-auto">
          <ILucidePenLine /> Editar
        </BButton>
        <BButton v-if="tipo.permisos.eliminar" :to="eliminar" variant="flat">
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
          {{ tipo.nombre }}
        </div>
      </div>
      <div class="w-100">
        <label class="form-label">Descripción</label>
        <div>
          {{ tipo.descripcion || '-' }}
        </div>
      </div>
      <div class="w-100">
        <label class="form-label">Uso</label>
        <div>
          {{ tipo.uso }}
        </div>
      </div>
      <template v-if="tipo.modified_by">
        <div class="pt-3 border-top">
          <label class="form-label">Modificado</label>
          <div>
            {{ tipo.modified_by }},
            {{ formatTime(tipo.modified_on) }}
          </div>
        </div>
      </template>
    </div>
  </div>
  <router-view v-if="tipo" />
</template>