<script setup>
import { PENDIENTE_STATUS, PERIODOS } from '@/constants'
import { useSolicitudesQuery, useSolicitudesFiltro } from '@/stores/solicitudes'
import { toRefs } from 'vue';

const { total, isPending, isStale, conteoEstados, refresh } = useSolicitudesQuery()
const { search_in, search, isFiltered, filtro } = toRefs(useSolicitudesFiltro())
</script>

<template>
  <BContainer fluid>
    <BRow v-if="isPending" class="footer-row" align-v="center">
      <BCol cols="auto">
        Cargando...
      </BCol>
    </BRow>
    <BRow v-else class="footer-row" align-v="center">
      <BCol cols="auto">
        {{ total }} {{ total === 1 ? 'elemento' : 'elementos' }}
      </BCol>
      <BCol v-if="isFiltered" cols="auto">
        <ILucideFunnel class="small" />
      </BCol>
      <BCol v-if="filtro.status" cols="auto" class="ps-0">
        {{PENDIENTE_STATUS.find(d => d.value === filtro.status).text}}
      </BCol>
      <BCol v-if="filtro.period" cols="auto" class="ps-0">
        terminadas en {{PERIODOS.find(d => d.value === filtro.period).text}}
      </BCol>
      <BCol v-if="search" cols="auto">
        <ILucideSearch class="small" />
      </BCol>
      <BCol v-if="search" cols="auto" class="ps-0 text-truncate" style="width:120px">
        {{ search }}
      </BCol>
      <!--  -->
      <BCol cols="auto" class="text-danger" v-if="isStale">
        <BButton variant="flat py-1 text-danger" @click="refresh" v-tippy="'Los datos pueden estar desactualizados'">
          <ILucideRefreshCcw class="small" />
          Actualizar
        </BButton>
      </BCol>
    </BRow>
  </BContainer>
</template>

<style scoped lang="scss">
.footer-row {
  height: 40px;
  color: var(--bs-warning-text-emphasis);
}
</style>
