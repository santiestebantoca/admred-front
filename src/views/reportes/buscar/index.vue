<script lang="ts" setup>
import BotonEnvio from '@/components/commons/BotonEnvio.vue'
import IndicadorCarga from '@/components/commons/IndicadorCarga.vue'
import { formatTime } from '@/composables/useDates'
import { useCodigosQuery } from '@/stores/reportes'
import type { ReporteCodigoRow } from '@/types/api'
import type { TableFieldRaw } from 'bootstrap-vue-next'
import type { RouteLocationRaw } from 'vue-router'
import { ref, inject, type Ref } from 'vue'

const props = defineProps<{
  linkSolicitud?: (solicitudId: number) => RouteLocationRaw
}>()

const value = ref<string>()
const { solicitudes, isPending, isLoading, codigo } = useCodigosQuery()
const title = inject<Ref<string>>('reportes:title')
const fields: TableFieldRaw<ReporteCodigoRow>[] = [
  { key: 'codigo', label: 'Código', tdClass: 'td-codigo' },
  { key: 'solicitado_en', label: 'Presentada', formatter: fechaformatter },
  { key: 'objetivo', label: 'Objetivo' },
  { key: 'origen', label: 'De' },
  { key: 'destino', label: 'A' },
]

title.value = 'Buscar código'

const submit = () => codigo.value = value.value
function fechaformatter({ value }: { value: unknown }) {
  return formatTime(value as string) || '-'
}
</script>

<template>
  <div class="pt-3">
    <p>Búsqueda de solicitudes por código — se muestran hasta 10 coincidencias. </p>
    <div class="p-3 mb-3 border rounded-3 surface-1">
      <BForm @submit.prevent="submit" class="hstack" :aria-busy="isLoading">
        <BFormInput v-model="value" placeholder="Código" required class="w-auto me-3" />
        <BotonEnvio type="submit" variant="primary" :loading="isLoading" :disabled="!value"
          texto-cargando="Buscando…">
          Buscar
        </BotonEnvio>
      </BForm>
    </div>
    <IndicadorCarga v-if="isPending && codigo" texto="Buscando coincidencias…"
      detalle="Consultando las solicitudes con ese código." />
    <div v-else-if="codigo && solicitudes" class="mb-4 p-3 border rounded-3">
      <p class="fw-semibold">
        Resultados
        <IndicadorCarga v-if="isLoading" inline texto="Actualizando…" class="ms-2" />
        <span class="text-secondary">
          ({{ solicitudes.length }})
        </span>
        <span v-if="solicitudes.length === 10" class="fw-normal mark bg-light px-1 rounded-3 small text-secondary">
          pueden existir más coincidencias.
        </span>
      </p>
      <template v-if="solicitudes.length">
        <BTable :fields="fields" :items="solicitudes" responsive table-class="my-3">
          <template #cell(codigo)="{ item }">
            <BButton :to="linkSolicitud(item.id)" variant="link">
              <ILucideCheck v-if="item.terminado_en" class="text-bg-info mark rounded-2" v-tippy="'Terminada'" />
              <ILucideClock v-else class="text-bg-warning mark rounded-2" v-tippy="'Pendiente'" />
              {{ item.codigo }}
            </BButton>
          </template>
        </BTable>
      </template>
      <div v-else class="py-3 text-center">
        La búsqueda no devolvió resultados.
      </div>
    </div>
  </div>
  <RouterView />
</template>

<style scoped lang="scss">
.list-group {
  max-width: fit-content;
  --bs-list-group-bg: var(--bs-surface-1);
}

:deep(.b-table th) {
  font-size: .875em;
  font-weight: 600;
  line-height: 24px;
}

:deep(.td-codigo) {
  padding: 0;

  .btn {
    white-space: nowrap;
    position: relative;
    top: 1px;
  }
}
</style>