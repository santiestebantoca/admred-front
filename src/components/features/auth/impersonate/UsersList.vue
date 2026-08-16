<script lang="ts" setup>
import {
  useImpersonateQuery,
  useImpersonate
} from '@/stores/auth'
import { BAccordion } from 'bootstrap-vue-next'
import { ref, computed, inject } from 'vue'

const { users } = useImpersonateQuery()
const { mutateAsync: impersonate, asyncStatus: status } = useImpersonate()
const mobile = inject('app:mobile')
</script>
<template>
  <BAccordion class="root">
    <BAccordionItem v-for="{ id, username, name, actual } in users" :title="name">
      <p class="mb-2">
      <div v-if="actual">(Actual)</div>
      <span v-if="username" class="text-muted small" v-text="username" />
      </p>
      <BButton @click="impersonate(id)" :disabled="actual">
        <UIcon name="bi-arrow-return-right" />
        <span v-if="!mobile" class="ms-2">Personificar</span>
      </BButton>
    </BAccordionItem>
  </BAccordion>
</template>

<style scoped>
.root {
  --bs-accordion-active-bg: transparent;
  --bs-accordion-btn-focus-box-shadow: none;

  :deep(.accordion-button:not(.collapsed)) {
    box-shadow: none;
  }
}
</style>