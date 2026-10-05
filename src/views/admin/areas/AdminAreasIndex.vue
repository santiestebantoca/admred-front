<script setup>
import { inject } from 'vue'

const title = inject('page:title')
title.value = 'Áreas'
</script>

<template>
  <router-view />
</template>