<!--
  https://github.com/devstark-com/vue-textarea-autosize/issues/34
  ... on some mobile browser the (v-model) binding doesn't update until
  the user types space.
-->

<script setup>
const error = defineModel('error')
const value = defineModel('value')

import { useDestinosSelectQuery } from '@/stores/destinos'
import { vOnClickOutside } from '@vueuse/components'
import { ref, computed, watch, onMounted } from 'vue'

const { destinos, historial, singleOption, search } = useDestinosSelectQuery()
const focus = ref(null) // input focus
const dropdown = ref(null)
const attrs = computed(() => ({
  value: search.value,
  readonly: singleOption.value,
  placeholder: active.value ? '' : 'Área consultada',
}))
const active = computed(() => focus.value || dropdown.value)
const para = computed(() => active.value || search.value)
const warning = computed(() => !active.value && !value.value)

watch(singleOption, d => d && select(d.id, d.nombre), { immediate: true })
watch(active, active => {
  if (!active && destinos.value.length) {
    const search_ = search.value?.trim().toLowerCase()
    const match = destinos.value.find(d => d.nombre.trim().toLowerCase() === search_)
    if (match) select(match.id, match.nombre)
  }
})
watch(value, () => error.value = null)
onMounted(() => search.value = null)

const select = (id, nombre) => {
  search.value = nombre
  value.value = id
  historial.add(id)
  dropdown.value = false
}
const input = val => {
  value.value = null
  search.value = val
}
const vInput = {
  mounted: el => {
    el.onfocus = () => {
      if (!singleOption.value) {
        focus.value = true
        dropdown.value = true
      }
    }
    el.onblur = () => focus.value = false
    el.oninput = () => input(el.value)
  }
}
</script>

<template>
  <BContainer v-on-click-outside="() => dropdown = false" class="mb-3">
    <BRow class="border-bottom position-relative" @click.stop>
      <BCol v-if="para" cols="auto" class="para-label">
        Para
      </BCol>
      <BCol class="px-1 hstack">
        <BFormInput v-input v-bind="attrs" :class="{ warning }" debounce="600" />
        <BDropdown v-model="dropdown" :auto-close="false" variant="emphasis">
          <BDropdownItemButton v-for="{ nombre, id, history } in destinos" :key="id" @click="select(id, nombre)"
            :class="{ history }">
            <IBiClockHistory v-if="history" />
            <IBiSearch v-else />
            {{ nombre }}
            <BButton v-if="history" @click.stop="historial.del(id)" v-tippy="'Eliminar del historial'"
              variant="close" />
          </BDropdownItemButton>
          <BDropdownText v-if="!destinos?.length">
            <span class="blockquote-footer">
              <em>Resultados de la busqueda y entradas recientes</em>
            </span>
          </BDropdownText>
        </BDropdown>
      </BCol>
    </BRow>
    <div class="small text-danger" v-text="error"></div>
  </BContainer>
</template>

<style scoped lang="scss">
.para-label {
  color: var(--bs-secondary-color);
  padding: 0.375rem 0.25rem;
  line-height: 1.5;
}

:deep(.form-control) {
  border: none;
  box-shadow: none !important;
  padding: 0.375rem 0.25rem;
}

:deep(.dropdown) {
  position: static;

  .dropdown-toggle {
    width: 30px;
    height: 30px;
    position: relative;
    left: 0.25rem;

    &::after {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .dropdown-menu {
    max-height: 318px;
    // overflow-x: hidden;
    width: 100% !important;
    transform: none !important;
    top: 100% !important;

    &:empty {
      height: 0;
      box-shadow: none;
      overflow: hidden;
    }
  }

  .dropdown-item {
    position: relative;

    .btn-close {
      display: none;
      width: 30px;
      height: 30px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 4px;
      padding: 0;
      font-size: var(--bs-x-small);

      &>svg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    &:hover {
      .btn-close {
        display: block;
      }
    }
  }
}

.warning {
  color: var(--bs-danger);
}
</style>