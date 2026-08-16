<script setup>
const value = defineModel()
const props = defineProps({
  name: String,
  placeholder: { type: String, default: 'Seleccionar' },
  options: Array,
  optionValue: { type: String, default: 'value' },
  optionLabel: { type: String, default: 'label' },
  optionCaption: { type: String, default: 'caption' },
  multiple: Boolean,
  maxHeight: { type: String, default: 'unset' }
})

import { computed, inject } from 'vue'

// const mobile = inject('app:mobile')
// const selection = computed(() => items.value.find(d => d.value === value.value) || {})
const items = computed(() => (props.options || []).map(d => ({
  value: d[props.optionValue],
  label: d[props.optionLabel],
  caption: d[props.optionCaption]
})))
</script>

<template>
  <!-- <template v-if="mobile"> -->
  <select class="form-select" v-model="value" :name="name" :multiple="multiple" :placeholder="placeholder">
    <option v-for="{ value, label } in items" :key="value" v-text="label" :value="value" />
  </select>
  <!-- </template>
<template v-else>
    <input type="hidden" :name="name" :value="value">
    <bs-dropdown>
      <bs-dropdown-toggle>
        <input class="form-select" readonly :value="selection.label" :placeholder="placeholder">
      </bs-dropdown-toggle>
      <bs-dropdown-menu class="form-select-options">
        <bs-dropdown-item v-for="item in items" :key="item.value" @click="value = item.value">
          <span v-text="item.label" />
          <div v-if="item.caption" v-text="item.caption" class="small text-muted" />
        </bs-dropdown-item>
      </bs-dropdown-menu>
    </bs-dropdown>
  </template> -->
</template>

<style scoped>
.form-select-options {
  width: 100%;
  max-height: v-bind(maxHeight);
  overflow: auto;
}
</style>