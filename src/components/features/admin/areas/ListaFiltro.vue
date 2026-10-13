<script setup>
import { useNivelesQuery } from '@/stores/niveles'
import { useAreasDelNivelQuery } from '@/stores/areas'
import { computed, ref } from 'vue'

// Los filtros son estado de quien usa el componente (ListaGrid); aquí sólo se
// editan los buffers locales y se emiten los cambios.
// Los buffers locales no cambian cuando el modelo cambia desde fuera (Puede ser un error).
// Se prefiere no usar placeholder porque el contexto ya es obvio.
const search = defineModel('search', { type: String })
const nombre = defineModel('nombre', { type: String })
const nivel = defineModel('nivel', { type: Number })
const padre = defineModel('padre', { type: Number })
const rol_key = defineModel('rol_key', { type: Boolean })
// Para el filtro
const form = ref({
  search: undefined,
  nombre: undefined,
  nivel: undefined, // id de nivel
  padre: undefined, // id de padre
  rol_key: undefined // true | undefined
})
const { niveles } = useNivelesQuery()
const emit = defineEmits(['reset'])
const dropdown = ref(false)
const inputValue = ref(undefined) // valor del input principal ej., "info nombre:informa"
const nivelPadre = computed(() => form.value.nivel
  ? niveles.value.find((d) => d.id === form.value.nivel).padre_id
  : undefined)
const { areas: padres, isPending: padresPending } = useAreasDelNivelQuery(nivelPadre)

const updateFormFromInput = () => {
  const obj = getValuesFromInput()
  form.value.search = obj.search
  form.value.nombre = obj.nombre
  form.value.nivel = obj.nivel // id de nivel
  form.value.padre = obj.padre // id de padre
  form.value.rol_key = obj.rol_key // true | undefined
}
const updateInputFromForm = () => {
  const text = []
  if (form.value.search) text.push(form.value.search.trim())
  if (form.value.nombre) text.push('nombre:' + form.value.nombre.trim())
  if (form.value.nivel) text.push('nivel:' + form.value.nivel)
  if (form.value.padre) text.push('de:' + form.value.padre)
  if (form.value.rol_key) text.push('marca:true')
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
        if (arrayValores[0] === 'nivel') obj.nivel = parseInt(arrayValores[1])
        if (arrayValores[0] === 'de') obj.padre = parseInt(arrayValores[1])
        if (arrayValores[0] === 'marca') obj.rol_key = true
      }
    }
  })
  return obj
}
const submit = () => {
  const obj = getValuesFromInput()
  search.value = obj.search
  nombre.value = obj.nombre
  nivel.value = obj.nivel
  padre.value = obj.padre
  rol_key.value = obj.rol_key || undefined
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
        <BFormGroup label="Nivel " label-cols-md="2" content-cols-md>
          <BFormSelect v-model="form.nivel" :options="niveles" text-field="nombre" value-field="id" />
        </BFormGroup>
        <BFormGroup v-if="nivelPadre" label="Padre " label-cols-md="2" content-cols-md>
          <BFormSelect v-model="form.padre" :options="padres" :disabled="!padres?.length || padresPending"
            text-field="nombre" value-field="id" />
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