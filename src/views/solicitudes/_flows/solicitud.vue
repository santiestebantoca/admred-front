<script setup lang="ts">
const props = defineProps({ back: Function })

import { ref, onMounted } from 'vue';

const model = ref(false)

onMounted(() => model.value = true)
</script>

<template>
  <BModal v-model="model" title="Solicitud" @hidden="back">
    Solicitud
  </BModal>
</template>
