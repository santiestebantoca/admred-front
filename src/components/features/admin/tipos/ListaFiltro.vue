<script setup>
import { ref } from 'vue'

// Los filtros son estado de quien usa el componente (ListaGrid); aquí sólo se
// editan los buffers locales y se emiten los cambios.
// Los buffers locales no cambian cuando el modelo cambia desde fuera (Puede ser un error).
// Se prefiere no usar placeholder porque el contexto ya es obvio.
const search = defineModel('search', { type: String })
const nombre = defineModel('nombre', { type: String })
const descripcion = defineModel('descripcion', { type: String })
// Para el filtro
const form = ref({
  search: undefined,
  nombre: undefined,
  descripcion: undefined,
})

const emit = defineEmits(['reset'])
const dropdown = ref(false)
const inputValue = ref(undefined) // valor del input principal ej., "info nombre:informa"

const updateFormFromInput = () => {
  const obj = getValuesFromInput()
  form.value.search = obj.search
  form.value.nombre = obj.nombre
  form.value.descripcion = obj.descripcion
}
const updateInputFromForm = () => {
  const text = []
  if (form.value.search) text.push(form.value.search.trim())
  if (form.value.nombre) text.push('nombre:' + form.value.nombre.trim())
  if (form.value.descripcion) text.push('desc:' + form.value.descripcion.trim())
  inputValue.value = text.join(' ')
  submit()
}
function getValuesFromInput() {
  if (!inputValue.value) return {}
  const arrayBloques = inputValue.value.split(' ')
  if (!arrayBloques.length) return {}
  const obj = {}
  arrayBloques.forEach((bloque) => {
    const arrayValores = bloque.split(':')
    if (arrayValores.length) {
      if (arrayValores.length === 1) obj.search = arrayValores[0]
      else {
        if (arrayValores[0] === 'nombre') obj.nombre = arrayValores[1]
        if (arrayValores[0] === 'desc') obj.descripcion = arrayValores[1]
      }
    }
  })
  return obj
}
const submit = () => {
  const obj = getValuesFromInput()
  search.value = obj.search
  nombre.value = obj.nombre
  descripcion.value = obj.descripcion
  dropdown.value = false
}
const reset = () => {
  inputValue.value = undefined
  emit('reset')
}
</script>

<template>
  <div class="root" v-resize-observer="onResizeObserver">
    <BButton variant="link link-dark wh-34 ms-1" @click="submit">
      <IBiSearch class="center" />
    </BButton>
    <BForm @submit.prevent="submit" class="flex-fill">
      <BInput v-model="inputValue" class="input" />
    </BForm>
    <BButton variant="link link-dark wh-34" v-if="inputValue" @click="reset">
      <IBiXLg class="center" />
    </BButton>
    <BDropdown v-model="dropdown" auto-close="outside" variant="link link-dark wh-34 me-1" no-caret
      @show="updateFormFromInput">
      <template #button-content>
        <IBiThreeDotsVertical class="center" />
      </template>
      <BForm @submit.prevent>
        <BRow class="align-items-baseline mb-3">
          <BCol cols="3">
            <label class="form-label">Buscar texto</label>
          </BCol>
          <BCol>
            <BInput v-model="form.search" />
          </BCol>
        </BRow>
        <BRow class="align-items-baseline mb-3">
          <BCol cols="2">
            <label class="form-label">Nombre</label>
          </BCol>
          <BCol>
            <BInput v-model="form.nombre" />
          </BCol>
        </BRow>
        <BRow class="align-items-baseline mb-3">
          <BCol cols="3">
            <label class="form-label">Descripción</label>
          </BCol>
          <BCol>
            <BInput v-model="form.descripcion" />
          </BCol>
        </BRow>
        <BButton variant="primary" @click="updateInputFromForm">
          Buscar
        </BButton>
      </BForm>
    </BDropdown>
  </div>
</template>

<style scoped lang="scss">
.root {
  max-width: 500px;
  display: flex;
  align-items: center;
  position: relative;
  border: 1px solid var(--bs-border-color);
  border-radius: var(--bs-border-radius-xl);

  .input {
    --bs-border-width: 0;
    box-shadow: none !important;
    line-height: 1.7em;
  }

  .dropdown {
    position: static;

    :deep(.dropdown-menu) {
      width: 100% !important;
      transform: none !important;
      top: 100% !important;
      padding: 16px;
    }
  }
}
</style>