<script setup>
const model = defineModel()
const props = defineProps({
  name: String,
  value: [String, Number, Object],
  label: String,
  caption: String,
  compact: { type: Boolean },
  reverse: Boolean,
  disable: Boolean,
  flat: Boolean
})

import { ref, getCurrentInstance } from 'vue'

const instance = getCurrentInstance()
const uuid = ref(instance.uid)
</script>

<template>
  <div class="form-check" :class="{ compact, 'form-check-reverse': reverse, flat }">
    <input :class="[flat ? 'flat' : 'form-check-input']" type="checkbox" :value="value" v-model="model"
      :id="`cb${uuid}`" :disabled="disable">
    <label class="form-check-label" :for="`cb${uuid}`">
      <div v-text="label" />
      <div v-text="caption" class="small text-muted" />
    </label>
  </div>
</template>

<style scoped>
.form-check:not(.compact) {
  --switch-padding-y: 6px;
  padding-top: var(--switch-padding-y);
  padding-bottom: var(--switch-padding-y);
}

.form-check.flat {
  position: relative;
}

input.flat {
  position: absolute;
  top: 50%;
  transform: translateY(-40%);
  left: .125rem;
}
</style>