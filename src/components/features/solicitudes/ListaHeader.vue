<script setup>

import ListaNav from './ListaNav.vue'
import { inject, ref } from 'vue'

const mobile = inject('app:mobile')
const tray = inject('solicitudes:tray')
const state = inject('solicitudes:state')
const flows = inject('solicitudes:flows')
const model = ref(false)

const closeDropdown = () => model.value = false
</script>

<template>
  <BContainer fluid>
    <BRow class="justify-content-between align-items-center" gutter-x="3">
      <BCol cols="auto">
        <div v-if="mobile" class="text-dark ps-2">
          <span class="letter-spacing-1">
            / {{ tray }} <span class="fw-semibold">{{ state }}</span>
          </span>
        </div>
        <template v-else>
          <BDropdown v-model="model" variant="link" auto-close="outside" no-caret :offset="{ alignmentAxis: 50 }">
            <template #button-content>
              <UIcon name="bi-folder-check" class="text-orange-800" />
              <UIcon name="lucide-chevron-right" class="small opacity-50" />
              <span class="letter-spacing-1 w-180">
                {{ tray }} <span class="fw--semibold">{{ state }}</span>
              </span>
            </template>
            <ListaNav :closeDropdown="closeDropdown" />
          </BDropdown>
        </template>
      </BCol>
      <BCol cols="auto">
        <BButton v-if="mobile" variant="primary  wh-34" @click="flows.crear.go">
          <UIcon name="bi-pencil-square" class="center" />
        </BButton>
        <BButton v-else variant="primary" @click="flows.crear.go">
          <UIcon name="lucide-plus" />
          Nueva solicitud
        </BButton>
      </BCol>
    </BRow>
  </BContainer>
</template>

<style scoped lang="scss">
:deep(.btn-link) {
  --bs-btn-color: var(--bs-info-900);
  --bs-btn-hover-color: var(--bs-info-900);
  --bs-btn-active-color: var(--bs-info-900);
  --bs-btn-bg: rgba(var(--bs-surface-5-rgb), .7);
  --bs-btn-hover-bg: rgba(var(--bs-surface-5-rgb), 1);
  --bs-btn-active-bg: rgba(var(--bs-surface-5-rgb), 1);

  .w-180 {
    display: inline-block;
    width: 180px;
    text-align: start;
    font-weight: 600;
  }

  svg.small {
    top: unset;
  }
}
</style>