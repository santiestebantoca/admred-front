<script setup>
const props = defineProps({ down: Boolean })

import UserWidget from '@/views/app/widgets/user/Dialog.vue'
import AppsWidget from '@/views/app/widgets/apps/Collapse.vue'
import useNavOptions from './base/nav'

const nav = useNavOptions().options
</script>

<template>
  <div class="h-100 d-flex flex-column bg-light-1 overflow-auto gap-1 pb-4">
    <bs-btn-close v-if="down" @click="$emit('hide')" class="m-1 ms-auto" />
    <h5 v-else class="p-3 mb-3">Administración</h5>
    <div class="px-1">
      <bs-btn v-for="_ in nav" flat color="primary" :to="_.to" @click="$emit('hide')" class="w-100 text-start">
        <i :class="`bi-${_.icon}`" class="me-3" />
        <span v-text="_.label" />
      </bs-btn>
    </div>
    <div class="m-auto" />
    <div class="border-bottom" />
    <div class="px-1">
      <AppsWidget />
    </div>
    <div class="border-bottom" />
    <UserWidget class="px-1" />
  </div>
</template>
