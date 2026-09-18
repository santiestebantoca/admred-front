<script setup>
const props = defineProps({
  solicitudId: Number,
  back: Function
})

import { useBitacorasQuery } from '@/stores/bitacoras'
import { formatTime } from '@/composables/useDates'
import { ref, onMounted } from 'vue'

const model = ref(false)
const { registros, isPending } = useBitacorasQuery(props.solicitudId)

onMounted(() => model.value = true)
</script>

<template>
  <BModal v-model="model" @hidden="back" title="Registro" no-footer size="lg">
    <div v-if="isPending" class="py-5 my-5 text-center">
      <BSpinner />
    </div>
    <template v-else>
      <BTableSimple>
        <BTbody>
          <BTr v-for="{ id, fecha, by, accion, argumentos } in registros" :key="id">
            <BTd class="text-nowrap text-success">
              {{ formatTime(fecha) }}
            </BTd>
            <BTd class="text-warning-emphasis">
              {{ by.username }}
            </BTd>
            <BTd class="fw-semibold">
              {{ accion }}
            </BTd>
            <BTd class="w-100">
              {{ argumentos }}
            </BTd>
          </BTr>
        </BTbody>
      </BTableSimple>
    </template>
  </BModal>
</template>