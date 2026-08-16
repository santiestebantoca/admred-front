<script setup>
const props = defineProps({ label: String })
</script>

<template>
  <li>
    <h6 class="dropdown-header">
      <slot />
      <span v-if="label" v-text="label" />
    </h6>
  </li>
</template>