<script setup>
import { useSolicitudesQuery } from '@/stores/solicitudes'

const { total, isLoading, isFiltered, isStale, conteoEstados, refresh } = useSolicitudesQuery()
</script>

<template>
  <BContainer fluid>
    <BRow class="footer-row" align-v="center">
      <BCol cols="auto" class="hstack">
        <!-- <UIcon name="ph-sigma" /> -->
        <UIcon name="tab-sum" />
        <small>
          Total: {{ total }}
          <template v-if="isFiltered">
            [Filtros aplicados]
          </template></small>
      </BCol>
      <BCol v-if="total" cols="auto">
        <UIcon name="tab-status-change" />
        <small>
          <template v-for="c, index in conteoEstados" :key="c.estado">
            <span v-if="c.cantidad" :data-estado="index" v-tippy="c.estado" class="ms-2">
              {{ c.cantidad }}
            </span>
          </template>
        </small>
      </BCol>
      <BCol cols="auto">
        <template v-if="isLoading">
          Cargando...
        </template>
        <template v-else-if="isStale">
          <BButton class="lh-1 px-2" variant="outline-secondary" size="sm" @click="refresh"
            v-tippy="'Datos antiguos (más de 5 minutos)'">
            Actualizar
          </BButton>
        </template>
      </BCol>
      <BCol cols="auto">
      </BCol>
    </BRow>
  </BContainer>
</template>

<style scoped lang="scss">
.footer-row {
  margin-top: 8px;
  height: 32px;
  color: var(--bs-secondary);

  .col {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  [data-estado="0"] {
    color: var(--bs-primary-600);
  }

  [data-estado="1"] {
    color: var(--bs-orange-600);
  }

  [data-estado="2"] {
    color: var(--bs-danger-600);
  }
}
</style>
