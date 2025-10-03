<script setup>
const model = defineModel()
const props = defineProps({
  name: String,
  value: [String, Number, Object],
  label: String,
  caption: String,
  compact: { type: Boolean, default: false },
  reverse: Boolean
})

import { ref, getCurrentInstance } from 'vue'

const instance = getCurrentInstance()
const uuid = ref(instance.uid)
</script>

<template>
  <div class="form-check" :class="{ compact, 'form-check-reverse': reverse }">
    <input class=" form-check-input" type="radio" :value="value" v-model="model" :id="`cb${uuid}`">
    <label class="form-check-label" :for="`cb${uuid}`">
      <div v-text="label" />
      <div v-text="caption" class="small text-muted" />
    </label>
  </div>
  <!-- <div class="form-check" :class="{ compact, 'form-check-reverse': reverse }">
    <input class="form-check-input" id="r2" type="radio" value="problema" v-model="store.order.by.field">
    <label class="form-check-label" for="r2">Problema</label>
  </div> -->
</template>

<style scoped>
.form-check:not(.compact) {
  padding: 6px 0;
}

.form-check:not(.compact):not(.form-check-reverse) {
  padding-left: 1.8em;
}

.form-check:not(.compact):not(.form-check-reverse) .form-check-input {
  margin-left: -1.8em;
}

/* reverse */

.form-check-reverse:not(.compact) {
  padding-right: 1.8em;
}

.form-check-reverse:not(.compact) .form-check-input {
  margin-right: -1.8em;
}
</style>