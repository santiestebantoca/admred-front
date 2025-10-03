<script setup>
const props = defineProps({ label: Boolean })

import { inject } from 'vue'

const id = inject('accordionItem:id')
const shown = inject('accordion:shown')
</script>

<template>
  <template v-if="label">
    <button class="accordion-button" data-bs-toggle="collapse" :data-bs-target="`#${id}`">
      {{ label }}
    </button>
  </template>
  <template v-else>
    <div data-bs-toggle="collapse" :data-bs-target="`#${id}`" type="button">
      <slot :shown="shown === id" />
    </div>
  </template>
</template>

<style scoped>
[type="button"] {
  user-select: none;
}
</style>