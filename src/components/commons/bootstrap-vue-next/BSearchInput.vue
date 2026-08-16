<script lang="ts" setup>
const model = defineModel<string>()
const props = defineProps({
  placeholder: { type: String, default: 'Buscar...' },
  searchIcon: Boolean,
  resetIcon: { type: Boolean, default: true },
  disabled: Boolean,
  debounce: { type: [String, Number], default: '600' }
})

import { computed } from 'vue'

const rootStyle = computed(() => ({
  '--c-padding-left': props.searchIcon ? '2rem' : '0.75rem',
  '--c-padding-right': props.resetIcon ? '2rem' : '0.75rem',
}))
const debounceValue = computed(() => Number(props.debounce))
</script>

<template>
  <div class="search-group" :style="rootStyle">
    <BFormInput v-model="model" :debounce="debounceValue" :placeholder="placeholder" :disabled="disabled" />
    <UIcon v-if="searchIcon" name="bi-search" />
    <BButton v-if="model" variant="flat-dark" class="btn-sm" @click="model = ''">
      <UIcon name="bi-x-lg" font-size="12px" />
    </BButton>
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

  .btn {
    position: absolute;
    top: 50%;
    right: 4px;
    height: 30px;
    width: 30px;
    padding: 0 !important;
    transform: translateY(-50%);
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
