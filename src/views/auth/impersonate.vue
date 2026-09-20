<script lang="ts" setup>
import UserCard from '@/components/features/auth/impersonate/UserCard.vue'
import UsersList from '@/components/features/auth/impersonate/UsersList.vue'
import { useAuthQuery, useImpersonateQuery } from '@/stores/auth'
import { computed } from 'vue'

const { authUser } = useAuthQuery()
const { users, isFiltered, search } = useImpersonateQuery()
const canSearch = computed(() => authUser.value?.can_impersonate)
</script>

<template>
  <div class="grid">
    <div class="card border-0 pt-md-4">
      <div class="header">
        <BButton to="/home" variant="link link-secondary">
          <IBiArrowLeft class="center" />
        </BButton>
        <h5 class="mb-1 b">Personificar</h5>
        <BSearchInput v-if="canSearch" v-model="search" placeholder="Buscar usuario" class="c" />
      </div>
      <div class="overflow-auto mt-3">
        <UsersList v-if="isFiltered" />
        <UserCard v-else />
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background-color: transparent;
}

:deep(.list-group-item) {
  height: auto !important;
  padding-bottom: 12px;
}

.grid {
  max-width: 500px;
  margin: 0 auto;
  min-height: inherit;
}

/** header */

.header {
  margin-top: .25rem;
  display: grid;
  grid-template-columns: min-content 1fr;
  grid-template-areas: "a c";
  align-items: center;
  row-gap: 1rem;
}

.header .btn-link {
  grid-area: a;
  margin-left: -8px;
  width: 34px;
  height: 34px;
  margin-right: 8px;
  --bs-btn-hover-bg: var(--bs-gray-200);
}

.header .b {
  grid-area: b;
  display: none;
}

.header .c {
  grid-area: c;
}

@media (min-width: 768px) {
  .header {
    margin-top: 0;
    grid-template-areas: "a b" "c c";
  }

  .header .b {
    display: block;
  }
}

@media (max-width: 767.98px) {
  .form-control {
    border: none;
    box-shadow: none;
    padding-left: 4px;
  }
}
</style>
