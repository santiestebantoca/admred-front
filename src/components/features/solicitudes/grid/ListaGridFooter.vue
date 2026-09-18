<script setup>
import { PENDIENTE_STATUS, PERIODOS } from '@/constants/solicitud'
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
        <UIcon name="bi-funnel" class="small" />
      </BCol>
      <BCol v-if="filtro.status" cols="auto" class="ps-0">
        {{PENDIENTE_STATUS.find(d => d.value === filtro.status).text}}
      </BCol>
      <BCol v-if="filtro.period" cols="auto" class="ps-0">
        terminadas en {{PERIODOS.find(d => d.value === filtro.period).text}}
      </BCol>
      <BCol v-if="search" cols="auto">
        <UIcon name="bi-search" class="small" />
      </BCol>
      <BCol v-if="search" cols="auto" class="ps-0 text-truncate" style="width:120px">
        {{ search }}
      </BCol>
      <!--  -->
      <BCol cols="auto" class="text-danger" v-if="isStale">
        <BButton variant="flat py-1 text-danger" @click="refresh" v-tippy="'Los datos pueden estar desactualizados'">
          <UIcon name="bi-arrow-repeat" class="small" />
          Actualizar
        </BButton>
      </BCol>
    </BRow>
  </BContainer>
</template>

<style scoped lang="scss">
.footer-row {
  // margin-top: 8px;
  height: 40px;
  color: var(--bs-warning-text-emphasis);

  // .col {
  //   display: flex;
  //   align-items: center;
  //   gap: 4px;
  // }

  // [data-estado="0"] {
  //   color: var(--bs-primary-600);
  // }

  // [data-estado="1"] {
  //   color: var(--bs-orange-600);
  // }

  // [data-estado="2"] {
  //   color: var(--bs-danger-600);
  // }
}
</style>
