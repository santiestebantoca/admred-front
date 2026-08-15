<script setup>
import FolderHeaderTab from './HeaderTab.vue'
import { inject, ref } from 'vue'

const mobile = inject('app:mobile')
const params = inject('folder:params')
const to = ref({ query: { compose: 'new' } })
</script>

<template>
  <div class="container-fluid hstack">
    <div v-if="mobile" class="text-dark">
      /<span v-text="params.tray" />/<span class="fw-semibold" v-text="params.state" />
    </div>
    <FolderHeaderTab v-else />
    <span class="mx-auto" />
    <bs-btn-icon v-if="mobile" icon="pencil-square" :to="to" style="background: var(--gg-light-2);" />
    <template v-else>
      <bs-btn color="primary" icon="plus-lg" :to="to" label="Nueva solicitud" />
    </template>
  </div>
</template>