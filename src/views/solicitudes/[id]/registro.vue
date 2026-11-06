<script lang="ts" setup>
const props = defineProps({
  solicitudId: Number,
  back: Function
})

import IndicadorCarga from '@/components/commons/IndicadorCarga.vue'
import { useBitacorasQuery } from '@/stores/bitacoras'
import { formatTime } from '@/composables/useDates'
import { ref, onMounted } from 'vue'

const model = ref(false)
const { registros, isPending } = useBitacorasQuery(props.solicitudId)

onMounted(() => model.value = true)
</script>

<template>
  <BModal v-model="model" @hidden="back()" title="Registro" no-footer size="lg">
    <IndicadorCarga v-if="isPending" texto="Cargando registro…" detalle="Consultando los movimientos de la solicitud." />
    <div v-else-if="!registros?.length" class="py-5 text-center text-muted">
      No hay movimientos registrados para esta solicitud.
    </div>
    <BTableSimple v-else>
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
  </BModal>
</template>
