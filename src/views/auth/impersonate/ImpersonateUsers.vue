<script setup>
import useAuthStore from '@/stores/auth'
import { ref, computed, inject } from 'vue'

const auth = useAuthStore()
const mobile = inject('app:mobile')
const items = computed(() => auth.impersonate.users.data)
const impersonate = user_id => auth.impersonate.post(user_id)
  .then(() => window.location.reload())
const show = ref(null)
const collapse = id => show.value = show.value !== id ? id : null
</script>
<template>
  <ul class="list-group">
    <li v-for="{ id, username, registration_key, name, area } in items" class="list-group-item" @click="collapse(id)"
      :key="id" type="button">
      <div class="text-truncate" :class="{ 'fw-semibold': show === id }">
        <span v-text="name" />
      </div>
      <div class="collapse" :class="{ show: show === id }">
        <p class="my-2">
          <span v-if="username" class="text-muted" v-text="'<' + username + '>'" />
          <span v-if="registration_key" class="text-danger fw-semibold" v-text="' -' + registration_key" />
        </p>
        <p class="text-secondary">@ {{ area }}</p>
        <template v-if="id !== auth.authUser.id">
          <template v-if="mobile">
            <bs-btn-icon icon="arrow-return-right" @click.stop="impersonate(id)" color="success" size="32px"
              class="px-0" />
          </template>
          <template v-else>
            <bs-btn icon="arrow-return-right" @click.stop="impersonate(id)" color="success" label="Personificar" />
          </template>
        </template>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.title {
  color: var(--bs-purple);
  font-weight: 600;
  font-size: .875em;
  margin-bottom: 4px;
}

.collapse {
  display: none;
}

.collapse.show {
  display: block;
}

.list-group-item:hover {
  background-color: var(--bs-gray-100);
}
</style>