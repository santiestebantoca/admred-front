<!-- 
  store.query is the source of true
  form is not sync with store.query until submition
 -->
<script setup>
const DIRECTFIELD = 'name'

import AreaSelect from './AreaSelect.vue'
import AuthGroupSelect from './AuthGroupSelect.vue'
import useStore from '@/stores/admin-users'
import { ref, computed } from 'vue'

const store = useStore().users
const dropdown = ref(null)
const formDefault = {
  name: null,
  area: undefined, // select field ::{id, label}
  group: undefined, // select field ::{id, label}
  blocked: false,
}
const form = ref({ ...formDefault })
const label = ref({})
const monitor = ref(null)
//
const submit = () => {
  const validEntries = Object.entries(form.value).filter(([k, v]) => v)
  store.query = Object.fromEntries(validEntries)
  dropdown.value = false
  //
  let text = []
  if (store.query.name) text.push(store.query.name)
  if (store.query.blocked) text.push('estado:blocked')
  if (store.query.area) text.push('area:' + label.value.area)
  if (store.query.group) text.push('rol:' + label.value.group)
  monitor.value = text.join(' ')
}
const reset = () => {
  form.value = { ...formDefault }
  submit()
}
const filtered = computed(() => store.isFiltered)
const direct = computed(() => !filtered.value || ((filtered.value === 1) && store.query[DIRECTFIELD]))
//
</script>

<template>
  <bs-dropdown class="x">
    <div class="margin">
      <form v-if="direct" @submit.prevent="submit">
        <input v-model="form[DIRECTFIELD]" placeholder="Buscar en nombre" class="form-control" />
      </form>
      <input v-else :value="monitor" readonly class="form-control" @click.stop="dropdown = true">
    </div>
    <bs-btn-icon icon="search" flat :disabled="!direct" @click="submit" class="btn-1" />
    <bs-btn-icon v-if="filtered" icon="x-lg" flat @click="reset" class="btn-2" />
    <bs-dropdown-toggle auto="outside" v-model="dropdown">
      <bs-btn-icon icon="sliders2" flat class="btn-3" />
    </bs-dropdown-toggle>
    <bs-dropdown-menu class="p-3 w-100">
      <form @submit.prevent>
        <div class="label-input">
          <label class="form-label">Nombre</label>
          <input v-model="form[DIRECTFIELD]" class="form-control" />
        </div>
        <div class="label-input">
          <label class="form-label">Área</label>
          <AreaSelect v-model="form.area" v-model:label="label.area" />
        </div>
        <div class="label-input">
          <label class="form-label">Rol</label>
          <AuthGroupSelect v-model="form.group" v-model:label="label.group" />
        </div>
        <div class="label-input">
          <bs-checkbox v-model="form.blocked" label="Bloqueado" />
        </div>
        <bs-btn label="Buscar" color="primary" @click="submit" />
      </form>
    </bs-dropdown-menu>
  </bs-dropdown>
</template>

<style scoped>
.label-input {
  margin-bottom: 13px;
  white-space: nowrap;
}

.form-label {
  padding-right: 16px;
  font-weight: 600;
  font-size: .875em;
}

@media(min-width:500px) {
  .label-input {
    display: flex;
    align-items: center;
  }

  .label-input>*:nth-child(2) {
    flex-grow: 1;
  }

  .form-label {
    font-size: 1em !important;
    font-weight: normal !important;
    color: var(--bs-gray-700);
    margin-bottom: 0;
  }
}

.x {
  border-radius: 2rem;
  background-color: #eaf1fb;
  height: 46px;
  padding: 1px 0;
}

.margin {
  margin: 0 76px 0 38px;
}

.margin .form-control {
  box-shadow: none;
  border: none;
  background-color: transparent;
  line-height: 2;
}

.btn-1 {
  position: absolute !important;
  top: 4px;
  left: 6px;
}

.btn-2 {
  position: absolute !important;
  top: 4px;
  right: 43px;
}

.btn-3 {
  position: absolute !important;
  top: 4px;
  right: 6px;
}
</style>
