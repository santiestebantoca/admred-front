<script setup>
import { inject } from 'vue'

const title = inject('page:title')
title.value = 'Usuarios'
</script>

<template>
  <router-view />
</template>
