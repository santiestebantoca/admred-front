<!--
  https://github.com/devstark-com/vue-textarea-autosize/issues/34
  ... on some mobile browser the (v-model) binding doesn't update until
  the user types space.
-->

<script setup>
const error = defineModel('error')
const value = defineModel('value')

import { useDestinosQuery } from '@/stores/destinos'
import { ref, computed, watch, onMounted } from 'vue'

import { vOnClickOutside, vResizeObserver } from '@vueuse/components'
const { destinos, history, singleOption, search } = useDestinosQuery()
const size = ref(0)
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
const dropdownStyle = computed(() => ({
  '--bs-dropdown-menu-width': `${size.value}px`,
}))

watch(singleOption, d => d && select(d.id, d.nombre), { immediate: true })
watch(active, active => {
  if (!active && destinos.value.length) {
    const search_ = search.value?.trim().toLowerCase()
    const match = destinos.value.find(d => d.nombre.trim().toLowerCase() === search_)
    if (match) select(match.id, match.nombre)
  }
})
watch(value, () => error.value = null)
function onResizeObserver(entries) {
  const [entry] = entries
  const { width } = entry.contentRect
  size.value = width
}
onMounted(() => search.value = null)

const select = (id, nombre) => {
  search.value = nombre
  value.value = id
  history.add(id)
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
  <div v-on-click-outside="() => dropdown = false" v-resize-observer="onResizeObserver" class="mb-3">
    <BContainer>
      <BRow class="border-bottom" @click.stop>
        <BCol v-if="para" cols="auto" class="para-label">
          Para
        </BCol>
        <BCol class="px-1 hstack">
          <BFormInput v-input v-bind="attrs" :class="{ warning }" debounce="600" />
          <BDropdown v-model="dropdown" offset="8" :auto-close="false" variant="link" placement="bottom-end"
            :style="dropdownStyle">
            <BDropdownItemButton v-for="{ nombre, id, history } in destinos" :key="id" @click="select(id, nombre)"
              :class="{ history }">
              <UIcon :name="history ? 'bi-clock-history' : 'bi-search'" class="small flex-shrink-0" />
              <span class="flex-shrink-1">{{ nombre }}</span>
              <BButton v-if="history" @click.stop="history.del(id)" v-tippy="'Eliminar del historial'"
                class="btn-eliminar" variant="link">
                <UIcon name="bi-x" />
              </BButton>
            </BDropdownItemButton>
            <BDropdownText v-if="!destinos?.length">
              <span class="blockquote-footer">
                <em>Resultados de la busqueda y entradas recientes</em>
              </span>
            </BDropdownText>
          </BDropdown>
        </BCol>
      </BRow>
    </BContainer>
    <div class="small text-danger" v-text="error"></div>
  </div>
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
  .dropdown-toggle {
    --bs-btn-color: var(--bs-secondary);
    --bs-btn-hover-color: var(--bs-secondary);
    --bs-btn-hover-bg: var(--bs-gray-200);
    --bs-btn-active-color: var(--bs-secondary);
    --bs-btn-active-bg: var(--bs-gray-200);
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
    width: var(--bs-dropdown-menu-width);
    max-height: 318px;
    overflow-y: auto;
    overflow-x: hidden;

    &:empty {
      height: 0;
      box-shadow: none;
      overflow: hidden;
    }
  }

  .dropdown-item {
    position: relative;

    .btn-eliminar {
      display: none;
      margin-left: auto;
      width: 30px;
      height: 30px;
      position: absolute;
      top: 2px;
      right: 4px;
      --bs-btn-bg: var(--bs-gray-200);
      --bs-btn-hover-bg: var(--bs-gray-300) !important;
      --bs-btn-active-bg: var(--bs-gray-300) !important;

      &>svg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    &:hover {
      .btn-eliminar {
        display: block;
      }
    }
  }
}

.warning {
  color: var(--bs-danger);
}
</style>