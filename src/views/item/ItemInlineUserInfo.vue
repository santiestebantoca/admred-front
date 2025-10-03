<script setup>
const props = defineProps({ user: Object })
import { ref, computed } from 'vue'

const telephone = computed(() => {
  const phones = []
  props.user.movil && phones.push(props.user.movil)
  props.user.fijo && phones.push(props.user.fijo)
  return phones.join(', ')
})
const blocked = computed(() => props.user.registration_key === 'blocked')
const collapse = ref(null)
</script>

<template>
  <div class="fw-normal" :class="{ blocked }">
    <a class="text-decoration-none hstack" @click="collapse = !collapse" type="button">
      <i class="bi-person pe-2" />
      <span v-text="user.name" class="text-truncate" />
      <i v-if="blocked" class="bi-exclamation-square ms-auto text-danger" />
    </a>
    <bs-collapse v-model="collapse">
      <div class="my-1 vstack py-1 data ps-1 ps-md-2 lh-lg border">
        <div v-if="blocked" class="text-danger">
          <i class="bi-exclamation-square me-1" />
          Usuario bloqueado
        </div>
        <div v-if="user.email">
          <i class="bi-envelope-fill me-1" />
          {{ user.email }}
        </div>
        <div v-if="telephone">
          <i class="bi-telephone-fill me-1" /> {{ telephone }}
        </div>
      </div>
    </bs-collapse>
  </div>
</template>

<style scoped>
.d-blocked-inline {
  display: none;
}

.blocked .d-blocked-inline {
  display: inline;
}

.blocked a {
  --name-color: var(--bs-danger);
}

.blocked .name:hover {
  --name-color: rgb(176, 42, 75);
}

.data {
  position: relative;
  background-color: var(--bs-gray-100);
  border-radius: 5px;
  border-top-left-radius: 0;
}
</style>