<script setup>

import ListaNav from './ListaNav.vue'
import { inject, ref } from 'vue'

const mobile = inject('app:mobile')
const params = inject('solicitudes:params')
const flows = inject('solicitudes:flows')
const model = ref(false)
</script>

<template>
  <BContainer fluid>
    <BRow class="justify-content-between align-items-center">
      <BCol cols="auto">
        <div v-if="mobile" class="text-dark">
          /<span v-text="params.tray" />/<span class="fw-semibold" v-text="params.state" />
        </div>
        <template v-else>
          <BDropdown v-model="model" variant="tab" auto-close="outside">
            <template #button-content>
              <UIcon name="bi-folder-check" />
              <span class="letter-spacing-1 w-180">
                <span class="text-dark text-opacity-75">
                  {{ params.tray }}
                </span>
                {{ params.state }}
              </span>
            </template>
            <ListaNav @input="model = false" />
          </BDropdown>
        </template>
      </BCol>
      <BCol cols="auto">
        <BButton v-if="mobile" variant="primary crear" @click="flows.crear.go">
          <UIcon name="bi-pencil-square" />
        </BButton>
        <BButton v-else variant="primary" @click="flows.crear.go">
          <UIcon name="bi-plus-lg" /> Nueva solicitud
        </BButton>
      </BCol>
    </BRow>
  </BContainer>
</template>

<style scoped lang="scss">
.crear {
  width: 34px;
  height: 34px;
  position: relative;

  >svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.w-180 {
  display: inline-block;
  width: 170px;
  text-align: center;
}

:deep(.btn-tab) {
  --bs-btn-color: inherit;
  --bs-btn-bg: var(--bs-gray-200);
  --bs-btn-hover-bg: var(--bs-gray-300);
  --bs-btn-active-bg: var(--bs-gray-300);
  --bs-btn-active-border-color: var(--bs-gray-500);
}
</style>