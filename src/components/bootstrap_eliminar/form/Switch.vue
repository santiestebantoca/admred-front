<script setup>
const model = defineModel()
const props = defineProps({
  name: String,
  value: [String, Number, Object],
  label: String,
  caption: String,
  compact: { type: Boolean },
  reverse: Boolean,
  disable: Boolean
})

import { ref, getCurrentInstance } from 'vue'

const instance = getCurrentInstance()
const uuid = ref(instance.uid)
</script>

<template>
  <div class="form-check form-switch" :class="{ compact, 'form-check-reverse': reverse }">
    <input class="form-check-input" type="checkbox" :value="value" v-model="model" :id="`cb${uuid}`" :disabled="disable"
      role="switch">
    <label class="form-check-label" :for="`cb${uuid}`">
      <div v-text="label" />
      <div v-text="caption" class="small text-muted" />
    </label>
  </div>
</template>

<style scoped>
.form-switch {
  /* --switch-padding: 2.5em;
  padding-left: var(--switch-padding); */
}

.form-check:not(.compact) {
  --switch-padding-y: 6px;
  padding-top: var(--switch-padding-y);
  padding-bottom: var(--switch-padding-y);
}

.form-check:not(.compact):not(.form-check-reverse) {
  /* padding-left: var(--switch-padding); */
}

.form-check:not(.compact):not(.form-check-reverse) .form-check-input {
  /* margin-left: -1.8em; */
}

/* reverse */

.form-check-reverse:not(.compact) {
  /* padding-right: var(--switch-padding); */
}

.form-check-reverse:not(.compact) .form-check-input {
  /* margin-right: -1.8em; */
}
</style>