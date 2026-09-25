<script lang="ts" setup>
import { useNavigationReportes } from '@/composables/useNavigation'

const { options } = useNavigationReportes()

import { inject } from 'vue'

const mobile = inject('app:mobile')
</script>
<template>
  <div class="grid">
    <BListGroup v-if="mobile" flush>
      <BListGroupItem v-for="{ to, label, icon } in options" :to="to">
        <UIcon :name="icon" />
        {{ label }}
      </BListGroupItem>
    </BListGroup>
    <ILucideChartColumn v-else class="icon" />
  </div>
</template>

<style scoped>
.grid {
  min-height: inherit;
  display: grid;
  justify-items: center;
  align-items: center;
  grid-template-rows: 1fr 72px;
}

.icon {
  font-size: 5rem;
  text-align: center;
  color: var(--bs-success-300);
}
</style>