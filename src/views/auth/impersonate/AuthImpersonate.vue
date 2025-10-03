<script setup>
import ImpersonateSearch from './ImpersonateSearch.vue'
import ImpersonateUser from './ImpersonateUser.vue'
import ImpersonateUsers from './ImpersonateUsers.vue'
import useAuthStore from '@/stores/auth'
import { computed } from 'vue'

const auth = useAuthStore()
const list = computed(() => auth.impersonate.users.isFiltered)
</script>

<template>
  <div class="grid">
    <div class="card border-0 pt-md-4">
      <div class="header">
        <bs-btn-back to="/home" style="margin-left: -8px;" class="a" />
        <h5 class="mb-0 b">Personificar</h5>
        <ImpersonateSearch class="c" />
      </div>
      <div class="overflow-auto mt-3">
        <ImpersonateUsers v-if="list" />
        <ImpersonateUser v-else />
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.header .a {
  grid-area: a;
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
</style>
