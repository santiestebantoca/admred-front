<!-- Errores globales (de Axios) -->
<script lang="ts" setup>
import { events } from '@/api/client'
import { ref, onMounted, onUnmounted } from 'vue'

const errorGlobal = ref<{ model: boolean | number; variant: 'info' | 'warning' | 'danger'; message: string | null }>({
  model: false,
  variant: 'info',
  message: null,
})

const handleError = ({ message, type }: { message: string; type: 'network' | 'server' | string }) => {
  errorGlobal.value.message = message
  errorGlobal.value.variant = type === 'network' ? 'danger' :
    type === 'server' ? 'warning' : 'info'
  errorGlobal.value.model = 3000
}

onMounted(() => events.on('error', handleError))
onUnmounted(() => events.off('error', handleError))
</script>

<template>
  <Teleport to="body">
    <div class="toast-container position-fixed top-0 end-0 p-3">
      <BToast v-model="errorGlobal.model" :variant="errorGlobal.variant" solid>
        {{ errorGlobal.message }}
      </BToast>
    </div>
  </Teleport>
</template>