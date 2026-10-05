<!-- if wizard is NOT terminated, the created record in deleted on unmount -->
<script setup>
const props = defineProps({ back: Function })

import useSnackbarStore from '@/stores/snackbar'
import useStore from '@/stores/admin-users'
import UserForm from './UserNewForm.vue'
import UserMembershipForm from '../user/membership/UserMembershipForm.vue'
import { ref, watch, computed, onBeforeUnmount } from 'vue'

const snackbar = useSnackbarStore()
const store = useStore()
const wizard = ref(1)
const id = ref(null)
const terminated = computed(() => wizard.value === 3)
watch(id, id => store.user.get(id).then(() => wizard.value++))
watch(terminated, () => {
  snackbar.add('Registro creado.')
  store.users.get().then(() => props.back())
})
onBeforeUnmount(() => {
  if (id.value && !terminated.value) store.user.del(id.value)
})
//
// wizard nav
const wizardLabels = ['', 'Datos generales', 'Grupos del usuario']
const wizardIcon = computed(() => `${wizard.value}-circle`)
const wizardLabel = computed(() => wizardLabels[wizard.value])
</script>

<template>
  <div class="data-box">
    <div class="data-header">
      <bs-btn-back @click="back" />
      <span class="fs-5">Nuevo registro</span>
    </div>
    <!-- wizard steps  -->
    <div v-if="!terminated" class="hstack gap-3 mt-md-1 mb-1 mb-md-3">
      <bs-icon :name="wizardIcon" fs="24px" class="text-success" />
      <span class="opacity-50 fw-semibold" v-text="wizardLabel" />
    </div>
    <!-- / -->
    <UserForm v-if="wizard === 1" v-model="id" />
    <UserMembershipForm v-else-if="wizard === 2" :id="id" v-model="wizard" end />
  </div>
</template>
