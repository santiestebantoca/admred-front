<!--
  https://github.com/devstark-com/vue-textarea-autosize/issues/34
  ... on some mobile browser the (v-model) binding doesn't update until
  the user types space.
-->

<script setup>
const error = defineModel('error')
const value = defineModel('value')

import useFolderStore from '@/stores/folder'
import { ref, computed, watch, onMounted } from 'vue'

const folder = useFolderStore()
folder.destinos.get()
const focus = ref(null) // input focus
const dropdown = ref(null)
onMounted(() => folder.destinos.search = null)
const select = (id, nombre) => {
  folder.destinos.search = nombre
  value.value = id
  folder.destinos.history.add(id)
  dropdown.value = false
}
const input = val => {
  value.value = null
  folder.destinos.search = val
}
const items = computed(() => folder.destinos.widget)
// One option logic
watch(() => folder.destinos.singleOption, d => d && select(d.id, d.nombre), { immediate: true })
// control appearance and behavior
const vInput = {
  mounted: el => {
    el.onfocus = () => {
      if (!folder.destinos.singleOption) {
        focus.value = true
        dropdown.value = true
      }
    }
    el.onblur = () => focus.value = false
    el.oninput = () => input(el.value)
  }
}
const attrs = computed(() => ({
  value: folder.destinos.search,
  readonly: folder.destinos.singleOption,
  placeholder: active.value ? '' : 'Área consultada',
}))
const active = computed(() => focus.value || dropdown.value)
const para = computed(() => active.value || folder.destinos.search)
const warning = computed(() => !active.value && !value.value)
const vUpdateScrollTop = { updated: el => el.scrollTop = 0 }
// Full coincidence logic
watch(active, active => {
  if (!active && items.value.length) {
    const search_ = folder.destinos.search?.trim().toLowerCase()
    const match = items.value.find(d => d.nombre.trim().toLowerCase() === search_)
    if (match) select(match.id, match.nombre)
  }
})
//
watch(value, () => error.value = null)
</script>

<template>
  <bs-dropdown class="mb-3">
    <div class="hstack border-bottom" @click.stop>
      <span v-if="para" class="form-control border-0 w-auto px-1 text-muted">
        Para
      </span>
      <input class="form-control input" :class="{ warning }" v-input v-bind="attrs" />
    </div>
    <bs-dropdown-toggle v-model="dropdown" auto="outside" />
    <bs-dropdown-menu v-update-scrollTop class="menu">
      <li v-for="{ nombre, id, history } in items" :key="id">
        <a class="dropdown-item" type="button" @click="select(id, nombre)" :class="{ history }">
          <i class="bi" />
          <span v-text="nombre" />
          <bs-btn-icon flat icon="x" class="btn-del" size="30px" @click.stop="folder.destinos.history.del(id)">
            <bs-tooltip placement="bottom" offset="0,10">Eliminar del historial</bs-tooltip>
          </bs-btn-icon>
        </a>
      </li>
    </bs-dropdown-menu>
    <div class="small text-danger" v-text="error"></div>
  </bs-dropdown>
</template>

<style scoped>
.warning {
  color: var(--bs-danger);
}

.input {
  border: none;
  box-shadow: none;
  padding-left: 4px;
}

.menu {
  overflow: auto;
  width: 100%;
  max-height: 320px;
}

.menu:empty {
  height: 0;
  box-shadow: none;
  overflow: hidden;
}

/** bi */

.bi {
  --bi-content: "\f52a";
  --bi-color: var(--bs-secondary);
  margin-right: 12px;
}

.bi::before {
  content: var(--bi-content);
  color: var(--bi-color);
}

.history>.bi::before {
  --bi-content: "\f293";
  --bi-color: var(--bs-teal);
}

/** btn-del */

.btn-del {
  visibility: hidden;
  font-size: 20px;
  margin-left: auto;
  position: relative;
  left: 10px
}

.history:hover>.btn-del {
  visibility: visible;
}
</style>
