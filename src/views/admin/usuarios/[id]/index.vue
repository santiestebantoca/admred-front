<script setup lang="ts">
const props = defineProps({
  showDetalle: Boolean,
  usuarioId: Number,
  back: Object,
  editar: Object,
  eliminar: Object,
})

import { formatTime } from '@/composables/useDates'
import { useUsuarioQuery } from '@/stores/usuarios'

const { usuario, isPending } = useUsuarioQuery(props.usuarioId)
</script>

<template>
  <div v-show="showDetalle" class="max-w-700">
    <div class="hstack gap-2 mb-4">
      <BButton :to="back" variant="flat wh-34 ms-n2">
        <ILucideArrowLeft class="center" />
      </BButton>
      <h5 class="mb-1">Detalles del usuario</h5>
      <template v-if="!isPending">
        <BButton :to="editar" variant="flat ms-auto">
          <ILucidePenLine /> Editar
        </BButton>
        <BButton v-if="usuario.permisos.eliminar" :to="eliminar" variant="flat">
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
          {{ usuario.first_name }} {{ usuario.last_name }}
        </div>
      </div>
      <div class="w-100">
        <label class="form-label">Nombre de usuario</label>
        <div>
          {{ usuario.username }}
        </div>
      </div>
      <div class="w-100">
        <label class="form-label">Correo</label>
        <div>
          {{ usuario.email || '-' }}
        </div>
      </div>
      <div class="w-100">
        <label class="form-label">Teléfonos</label>
        <div>
          {{ [usuario.movil, usuario.fijo].filter(Boolean).join(', ') || '-' }}
        </div>
      </div>
      <div class="w-100">
        <label class="form-label">Pertenece al área</label>
        <div>
          {{ usuario.area.nombre }}
        </div>
      </div>
      <div class="w-100">
        <label class="form-label">Grupos</label>
        <div class="text-uppercase">
          {{usuario.grupos.map((grupo) => grupo.role).join(', ') || '-'}}
        </div>
      </div>
      <div v-if="usuario.registration_key === 'blocked'" class="w-100 bg-danger-subtle text-center p-2">
        <span class="text-danger small fw-semibold">Registro bloquedo</span>
      </div>
      <template v-if="usuario.modified_by">
        <div class="pt-3 border-top">
          <label class="form-label">Modificado</label>
          <div>
            {{ usuario.modified_by }},
            {{ formatTime(usuario.modified_on) }}
          </div>
        </div>
      </template>
    </div>
  </div>
  <router-view />
</template>