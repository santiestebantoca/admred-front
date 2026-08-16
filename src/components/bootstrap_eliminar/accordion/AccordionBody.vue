<script setup>
import { inject } from 'vue'

const id = inject('accordionItem:id')
const parent = inject('accordion:id')
</script>

<template>
  <div :id="id" class="accordion-collapse collapse" :data-bs-parent="`#${parent}`">
    <div class="accordion-body" v-bind="$attrs">
      <slot />
    </div>
  </div>
</template>