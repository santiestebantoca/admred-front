<script lang="ts" setup>
const modo = defineModel<'lista' | 'navegar'>({ default: 'lista' })
</script>

<template>
  <BButtonGroup role="group" aria-label="Modo de visualización de áreas">
    <BButton type="button" :variant="modo === 'lista' ? 'primary' : 'flat'"
      :aria-pressed="modo === 'lista'" @click="modo = 'lista'">
      Lista
    </BButton>
    <BButton type="button" :variant="modo === 'navegar' ? 'primary' : 'flat'"
      :aria-pressed="modo === 'navegar'" @click="modo = 'navegar'">
      Navegar
    </BButton>
  </BButtonGroup>
</template>
