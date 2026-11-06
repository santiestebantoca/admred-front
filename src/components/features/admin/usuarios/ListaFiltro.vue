<script lang="ts" setup>
import { ROLES_DEL_USUARIO, ESTADOS_DEL_USUARIO } from '@/constants'
import { useAuthQuery } from '@/stores/auth'
import { useAreasOpcionesQuery } from '@/stores/areas'
import { ref, computed } from 'vue'

// Los filtros son estado de quien usa el componente (ListaGrid); aquí sólo se
// editan los buffers locales y se emiten los cambios.
// Los buffers locales no cambian cuando el modelo cambia desde fuera (Puede ser un error).
// Se prefiere no usar placeholder porque el contexto ya es obvio.
const search = defineModel('search', { type: String })
const nombre = defineModel('nombre', { type: String })
const area = defineModel('area', { type: Number })
const rol = defineModel('rol', { type: String })
const estado = defineModel('estado', { type: String })
/** Valores que viajan entre el input de texto, el formulario y los modelos. */
type FiltroUsuarios = {
  search?: string
  nombre?: string
  area?: number
  rol?: string
  estado?: string
}
// Para el filtro
const form = ref<FiltroUsuarios>({
  search: undefined,
  nombre: undefined,
  area: undefined,
  rol: undefined,
  estado: undefined
})
const { authUser } = useAuthQuery()
const showArea = computed(() => authUser.value?.AR)
const { areas } = useAreasOpcionesQuery(showArea)
const emit = defineEmits(['reset'])
const dropdown = ref(false)
const inputValue = ref(undefined) // valor del input principal ej., "info nombre:informa"

const updateFormFromInput = () => {
  const obj = getValuesFromInput()
  form.value.search = obj.search
  form.value.nombre = obj.nombre
  form.value.area = obj.area
  form.value.rol = obj.rol
  form.value.estado = obj.estado
}
const updateInputFromForm = () => {
  const text = []
  if (form.value.search) text.push(form.value.search.trim())
  if (form.value.nombre) text.push('nombre:' + form.value.nombre.trim())
  if (form.value.area) text.push('area:' + form.value.area)
  if (form.value.rol) text.push('rol:' + form.value.rol)
  if (form.value.estado) text.push('estado:' + form.value.estado)
  inputValue.value = text.join(' ')
  submit()
}
function getValuesFromInput(): FiltroUsuarios {
  if (!inputValue.value) return {}
  const arrayBloques = inputValue.value.split(' ')
  if (!arrayBloques.length) return {}
  const obj: FiltroUsuarios = {}
  arrayBloques.forEach((bloque) => {
    const arrayValores = bloque.split(':')
    if (arrayValores.length) {
      if (arrayValores.length === 1) obj.search = arrayValores[0]
      else {
        if (arrayValores[0] === 'nombre') obj.nombre = arrayValores[1]
        if (arrayValores[0] === 'area') obj.area = parseInt(arrayValores[1])
        if (arrayValores[0] === 'rol') obj.rol = arrayValores[1]
        if (arrayValores[0] === 'estado') obj.estado = arrayValores[1]
      }
    }
  })
  return obj
}
const submit = () => {
  const obj = getValuesFromInput()
  search.value = obj.search
  nombre.value = obj.nombre
  area.value = obj.area
  rol.value = obj.rol
  estado.value = obj.estado
  dropdown.value = false
}
const reset = () => {
  inputValue.value = undefined
  emit('reset')
}
</script>

<template>
  <div class="root">
    <BButton variant="link link-dark wh-34 ms-1" @click="submit">
      <ILucideSearch class="center" />
    </BButton>
    <BForm @submit.prevent="submit" class="flex-fill">
      <BInput v-model="inputValue" class="input" />
    </BForm>
    <BButton variant="link link-dark wh-34" v-if="inputValue" @click="reset">
      <ILucideX class="center" />
    </BButton>
    <BDropdown v-model="dropdown" auto-close="outside" variant="link link-dark wh-34 me-2" no-caret
      @show="updateFormFromInput">
      <template #button-content>
        <ILucideSlidersHorizontal class="center" />
      </template>
      <BForm @submit.prevent="updateInputFromForm" density="3">
        <BFormGroup label="Buscar texto" label-cols-md="3" content-cols-md>
          <BInput v-model="form.search" />
        </BFormGroup>
        <BFormGroup label="Nombre" label-cols-md="2" content-cols-md>
          <BInput v-model="form.nombre" />
        </BFormGroup>
        <BFormGroup v-if="showArea" label="Área" label-cols-md="2" content-cols-md>
          <BFormSelect v-model="form.area" :options="areas" />
        </BFormGroup>
        <BFormGroup label="Grupos" label-cols-md="2" content-cols-md="auto">
          <BFormSelect id="rol-select" v-model="form.rol" :options="ROLES_DEL_USUARIO" />
        </BFormGroup>
        <BFormGroup label="Clave de registro" label-cols-md="4" content-cols-md="auto">
          <BFormSelect id="rol-select" v-model="form.estado" :options="ESTADOS_DEL_USUARIO" />
        </BFormGroup>
        <BFormButtons>
          <BButton type="submit" variant="primary">
            Buscar
          </BButton>
        </BFormButtons>
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