<script lang="ts" setup>
const model = defineModel<string>()
const props = defineProps({
  placeholder: { type: String, default: '' },
  searchIcon: Boolean,
  resetIcon: { type: Boolean, default: true },
  debounce: { type: [String, Number], default: '600' },
  lazy: Boolean,
})

import { computed, ref, watch } from 'vue'

const localValue = ref(model.value ?? '')
const inputModel = computed({
  get: () => (props.lazy ? localValue.value : model.value),
  set: (val) => {
    if (props.lazy) {
      localValue.value = val ?? ''
    } else {
      model.value = val
    }
  },
})
const computedPlaceholder = computed(() => {
  if (props.placeholder) return props.placeholder
  return props.lazy ? 'Buscar... (Presiona Enter ↵)' : 'Buscar...'
})
const rootStyle = computed(() => ({
  '--c-padding-left': props.searchIcon ? '2rem' : '0.75rem',
  '--c-padding-right': props.resetIcon ? '2rem' : '0.75rem',
}))

const debounceValue = computed(() => (props.lazy ? 0 : Number(props.debounce)))

watch(model, (newValue) => {
  if (props.lazy) {
    localValue.value = newValue ?? ''
  }
})

const handleKeyupEnter = () => {
  if (props.lazy) {
    model.value = localValue.value
  }
}
const handleReset = () => {
  localValue.value = undefined
  model.value = undefined
}
</script>

<template>
  <div class="search-group" :style="rootStyle">
    <BFormInput v-model="inputModel" :debounce="debounceValue" :placeholder="computedPlaceholder"
      @keyup.enter="handleKeyupEnter" v-bind="$attrs" type="search" enterkeyhint="search" />
    <UIcon v-if="searchIcon" name="bi-search" />
    <BButton v-if="inputModel" variant="close" @click="handleReset" />
  </div>
</template>

<style scoped lang="scss">
.form-control {
  padding-left: var(--c-padding-left);
  padding-right: var(--c-padding-right);
}

.search-group {
  position: relative;
  flex-grow: 1;

  .btn-close {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 4px;
    height: 30px;
    width: 30px;
    padding: 0;
    --bs-btn-font-size: var(--bs-x-small);
  }

  >svg {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: var(--bs-gray-600);
    left: 10px;
    font-size: .9em;
  }
}
</style>