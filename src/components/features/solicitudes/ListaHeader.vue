<script setup>
import ListaNav from './ListaNav.vue'
import { inject, ref } from 'vue'

const mobile = inject('app:mobile')
const tray = inject('solicitudes:tray')
const state = inject('solicitudes:state')
const linkCrear = inject('solicitudes:linkCrear')
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
              <ILucideFolder style="color:var(--bs-gray-800)" />
              <ILucideChevronRight class="small opacity-50" />
              <span class="letter-spacing-1 w-180">
                {{ tray }} {{ state }}
              </span>
            </template>
            <ListaNav :closeDropdown="closeDropdown" />
          </BDropdown>
        </template>
      </BCol>
      <BCol cols="auto">
        <BButton v-if="mobile" variant="primary  wh-34" :to="linkCrear">
          <ILucidePlus class="center" />
        </BButton>
        <BButton v-else variant="primary" :to="linkCrear">
          <ILucidePlus />
          Nueva solicitud
        </BButton>
      </BCol>
    </BRow>
  </BContainer>
</template>

<style scoped lang="scss">
:deep(.dropdown-toggle) {
  --bs-btn-color: var(--bs-dark);
  --bs-btn-hover-color: var(--bs-dark);
  --bs-btn-active-color: var(--bs-dark);
  --bs-btn-bg: rgba(var(--bs-surface-5-rgb), .7);
  --bs-btn-hover-bg: rgba(var(--bs-surface-5-rgb), 1);
  --bs-btn-active-bg: rgba(var(--bs-surface-5-rgb), 1);

  .w-180 {
    display: inline-block;
    width: 172px;
    text-align: start;
    font-weight: 600;
  }

  svg.small {
    top: unset;
  }
}
</style>