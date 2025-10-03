<script setup>
import useSnackbarStore from '@/stores/snackbar'

const snackbar = useSnackbarStore()
</script>

<template>
  <div class="toast-container position-fixed bottom-0 start-0 p-4">
    <bs-toast v-for="d in snackbar.data" :key="d.timestamp" :text="d.text" @hidden="snackbar.del(d.timestamp)" />
  </div>
</template>