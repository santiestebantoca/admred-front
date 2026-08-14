<script setup>
import FolderHeaderTab from './HeaderTab.vue'
import useFolderStore from '@/stores/folder'
import { inject, ref } from 'vue'

const mobile = inject('app:mobile')
const params = inject('folder:params')
const folder = useFolderStore()
const to = ref({ query: { compose: 'new' } })
const actualizar = () => {
  folder.get()
  folder.pending.get()
}
</script>

<template>
  <div class="hstack px-3 bg">
    <div v-if="mobile" class="text-dark">
      /<span v-text="params.tray" />/<span class="fw-semibold" v-text="params.state" />
    </div>
    <FolderHeaderTab v-else />
    <span class="mx-auto" />
    <bs-btn-icon v-if="mobile" icon="pencil-square" :to="to" style="background: var(--gg-light-2);" />
    <template v-else>
      <bs-btn color="primary" :to="to" label="Nueva solicitud" class="me-3" />
      <bs-btn-icon @click="actualizar" flat icon="arrow-repeat" style="font-size:1.3em">
        <bs-tooltip placement="bottom" offset="0,10">Actualizar</bs-tooltip>
      </bs-btn-icon>
    </template>
  </div>
</template>

<style scoped>
.bg {
  /* background: linear-gradient(var(--gg-light-1) 49px, var(--gg-light-2)); */
  /* background: linear-gradient(90deg, var(--gg-light-1), var(--gg-light-2)); */
  background: var(--gg-light-1);
}
</style>
