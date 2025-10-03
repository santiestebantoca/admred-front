<script setup>
import { ref, getCurrentInstance, provide } from 'vue'

const instance = getCurrentInstance()
const id = ref(`accordionItem${instance.uid}`)
provide('accordionItem:id', id)
</script>

<template>
  <div class="accordion-item">
    <slot />
  </div>
</template>