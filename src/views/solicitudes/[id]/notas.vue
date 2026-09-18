<script setup lang="ts">
const props = defineProps({
  solicitudId: Number,
  back: Function
})

import { isValidationError } from '@/api/client'
import { useSolicitudQuery } from '@/stores/solicitudes'
import { useNotasQuery, useNotaCreate } from '@/stores/notas'
import type { NotaCreate } from '@/types/models.js'
import { ref, useTemplateRef, watch, onMounted, nextTick } from 'vue'

const model = ref(false)
const modalBody = useTemplateRef('modalBody')
const form = ref<NotaCreate>({
  texto: null,
  solicitud: props.solicitudId
})
const errors = ref<Record<string, any>>({})
const { notas, isPending } = useNotasQuery(props.solicitudId)
const { mutateAsync: crearNota, asyncStatus } = useNotaCreate()
const { solicitud, isPending: solicitudPendiente } = useSolicitudQuery()

onMounted(() => model.value = true)
watch(notas, () => nextTick(() => scroll()))

const scroll = () => modalBody.value.scrollTop = modalBody.value.scrollHeight
const validate = () => {
  errors.value = {}
  if (!form.value.texto) errors.value.destino = 'Este campo no puede estar vacío'
  return !Object.keys(errors.value).length
}
const submit = async () => {
  if (!validate()) return
  crearNota(form.value)
    .then(() => {
      form.value.texto = null
    })
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      // errors.value.form = 'Error al crear la nota.'
      // TODO: poner un toast indicando el fallo
    })
}
</script>

<template>
  <BModal v-model="model" @shown="scroll" @hidden="back" title="Notas" size="lg" body-class="p-0 bg-light"
    footer-class="p--0 border-top-0 bg-light">
    <div ref="modalBody" class="db px-3">
      <div v-for="fecha in Object.keys(notas)" :key="fecha">
        <div class="fecha">
          {{ fecha }}
        </div>
        <div v-for="nota in notas[fecha]" :key="nota.id" class="renglon" :class="[nota.como]">
          <div class="avatar d-none d-sm-inline" v-tippy="nota.autor.name">
            {{ nota.autor.name.slice(0, 1).toUpperCase() }}
          </div>
          <div class="nota">
            <div>
              <div class="mb-1 small hstack d-sm-none">
                <span class=" fw-bold text-truncate" v-text="nota.autor" />
                <span class="text-no-wrap ms-3"> {{ nota.hora }} </span>
              </div>
              <div class="mb-3 text-danger" v-if="nota.evento">[{{ nota.evento }}]</div>
              <div class="lh-sm" v-text="nota.texto" />
            </div>
          </div>
          <span class="hora d-none d-sm-inline">
            {{ nota.hora }}
          </span>
        </div>
      </div>
    </div>
    <template #footer data-class="bg-light">
      <form v-if="solicitud.permisos.comentar" @submit.prevent class="w-100">
        <div class="hstack gap-2">
          <BFormTextarea placeholder="Escribe una nota" no-resize rows="1" v-model="form.texto" />
          <BButton v-if="form.texto" variant="link link-primary" @click="submit" class="fs-4 wh-50">
            <UIcon name="bi-send-fill" class="center" />
          </BButton>
        </div>
      </form>
      <div v-else class="solo-lectura">Solo lectura</div>
    </template>
  </BModal>
</template>

<style scoped lang="scss">
.fecha {
  color: var(--bs-secondary);
  font-size: small;
  margin-top: 16px;
  margin-bottom: 12px;
  text-align: center;
}

.renglon {
  --renglon-flex-direction: row-reverse;
  display: flex;
  padding-top: 4px;
  padding-bottom: 12px;
  gap: 8px;
  flex-direction: var(--renglon-flex-direction);


  &.tramitador {
    --avatar-color: var(--bs-primary-800);
    --avatar-bg: var(--bs-primary-bg-subtle);
    --nota-color: var(--bs-white);
    --nota-bg: var(--bs-primary);
  }

  &.supervisor {
    --avatar-color: var(--bs-gray-700);
    --avatar-bg: var(--bs-gray-400);
    --nota-color: var(--bs-dark);
    --nota-bg: var(--bs-secondary-bg-subtle);
  }

  &.remitente {
    --renglon-flex-direction: row;
    --avatar-color: var(--bs-success-800);
    --avatar-bg: var(--bs-success-100);
    --nota-color: var(--bs-dark);
    --nota-bg: var(--bs-success-bg-subtle);
  }

  .avatar {
    color: var(--avatar-color);
    background-color: var(--avatar-bg);
    width: 34px;
    height: 34px;
    font-size: 1.3em;
    border-radius: var(--bs-border-radius-xl);
    text-align: center;
    cursor: default;
  }

  .nota {
    color: var(--nota-color);
    background-color: var(--nota-bg);
    max-width: 500px;
    min-width: 100px;
    border-radius: var(--bs-border-radius-xl);
    box-shadow: var(--bs-box-shadow-sm);
    padding: 8px 14px 12px;
  }

  .hora {
    margin: auto 8px 10px;
    font-size: 14px;
    color: var(--bs-gray-700);
  }
}

textarea {
  border: none;
  width: 100%;
  padding: 8px 16px;
  border-radius: var(--bs-border-radius-lg);
  box-shadow: var(--bs-box-shadow-sm);
}

.db {
  height: 340px;
  scroll-behavior: smooth;
  overflow: auto;
}

.solo-lectura {
  font-size: small;
  color: var(--bs-gray-700);
  text-align: center;
  width: 100%;
  position: relative;
  top: 8px;
  background-color: white;
}
</style>
