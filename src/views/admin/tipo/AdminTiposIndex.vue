<script setup>
import { inject } from 'vue'

const title = inject('page:title')
title.value = 'Tipos'
</script>

<template>
  <router-view />
</template>