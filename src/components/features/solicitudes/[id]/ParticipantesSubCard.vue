<script setup>
const props = defineProps({
  solicitud: Object,
})
</script>

<template>
  <BListGroup>
    <BListGroupItem>
      <span class="fw-semibold text-gray-800" v-tippy="'Remitente'">Rem:</span>
      <span class="data" id="remitente-popover">
        <IBiExclamationCircleFill v-if="solicitud.remitente.blocked" />
        {{ solicitud.remitente.name }}
      </span>
    </BListGroupItem>
    <template v-if="(solicitud.estado.id > 1)">
      <template v-if="solicitud.supervisor.id === solicitud.tramitador.id">
        <BListGroupItem>
          <span class="fw-semibold text-gray-800" v-tippy="'Supervisor/Tramitador'">S/Tram:</span>
          <span class="data" id="supervisor-popover">
            <IBiExclamationCircleFill v-if="solicitud.supervisor.blocked" />
            {{ solicitud.supervisor.name }}
          </span>
        </BListGroupItem>
      </template>
      <template v-else>
        <template v-if="solicitud.supervisor">
          <BListGroupItem>
            <span class="fw-semibold text-gray-800" v-tippy="'Supervisor'">Sup:</span>
            <span class="data" id="supervisor-popover">
              <IBiExclamationCircleFill v-if="solicitud.supervisor.blocked" />
              {{ solicitud.supervisor.name }}
            </span>
          </BListGroupItem>
        </template>
        <template v-if="solicitud.tramitador">
          <BListGroupItem>
            <span class="fw-semibold text-gray-800" v-tippy="'Tramitador'">Tram:</span>
            <span class="data" id="tramitador-popover">
              <IBiExclamationCircleFill v-if="solicitud.tramitador.blocked" />
              {{ solicitud.tramitador.name }}
            </span>
          </BListGroupItem>
        </template>
      </template>
    </template>
  </BListGroup>
  <BPopover target="remitente-popover" placement="bottom-start" offset="0" :delay="{ show: 1000, hide: 100 }"
    class="no-arrow lg rounded-4 shadow ms-5" body-class="surface-3 rounded-4">
    <BRow gutter-x="3">
      <BCol cols="auto">
        <img src="@/assets/images/user-lg.png" width="70" />
      </BCol>
      <BCol>
        <h5 class="mb-2">{{ solicitud.remitente.name }}</h5>
        <div v-if="solicitud.remitente.email" class="text-secondary mb-2">
          {{ solicitud.remitente.email }}
        </div>
        <div v-if="solicitud.remitente.movil || solicitud.remitente.fijo" class="mb-2">
          Tel. {{ [
            ...solicitud.remitente.movil ? [solicitud.remitente.movil] : [],
            ...solicitud.remitente.fijo ? [solicitud.remitente.fijo] : []
          ].join(', ') }}
        </div>
      </BCol>
      <BCol v-if="solicitud.remitente.blocked" cols="12">
        <div class="text-bg-danger rounded-4 text-center p-2">
          <b>Usuario inactivo (bloqueado)</b>
        </div>
      </BCol>
    </BRow>
  </BPopover>
  <BPopover target="supervisor-popover" placement="bottom-start" offset="0" lazy :delay="{ show: 1000, hide: 100 }"
    class="no-arrow lg rounded-4 shadow ms-5" body-class="surface-3 rounded-4">
    <BRow gutter-x="3">
      <BCol cols="auto">
        <img src="@/assets/images/user-lg.png" width="70" />
      </BCol>
      <BCol>
        <h5 class="mb-2">{{ solicitud.supervisor.name }}</h5>
        <div v-if="solicitud.supervisor.email" class="text-secondary mb-2">
          {{ solicitud.supervisor.email }}
        </div>
        <div v-if="solicitud.supervisor.movil || solicitud.supervisor.fijo" class="mb-2">
          Tel. {{ [
            ...solicitud.supervisor.movil ? [solicitud.supervisor.movil] : [],
            ...solicitud.supervisor.fijo ? [solicitud.supervisor.fijo] : []
          ].join(', ') }}
        </div>
      </BCol>
      <BCol v-if="solicitud.supervisor.blocked" cols="12">
        <div class="text-bg-danger rounded-4 text-center p-2">
          <b>Usuario inactivo (bloqueado)</b>
        </div>
      </BCol>
    </BRow>
  </BPopover>
  <BPopover target="tramitador-popover" placement="bottom-start" offset="0" lazy :delay="{ show: 1000, hide: 100 }"
    class="no-arrow lg rounded-4 shadow ms-5" body-class="surface-3 rounded-4">
    <BRow gutter-x="3">
      <BCol cols="auto">
        <img src="@/assets/images/user-lg.png" width="70" />
      </BCol>
      <BCol>
        <h5 class="mb-2">{{ solicitud.tramitador.name }}</h5>
        <div v-if="solicitud.tramitador.email" class="text-secondary mb-2">
          {{ solicitud.tramitador.email }}
        </div>
        <div v-if="solicitud.tramitador.movil || solicitud.tramitador.fijo" class="mb-2">
          Tel. {{ [
            ...solicitud.tramitador.movil ? [solicitud.tramitador.movil] : [],
            ...solicitud.tramitador.fijo ? [solicitud.tramitador.fijo] : []
          ].join(', ') }}
        </div>
      </BCol>
      <BCol v-if="solicitud.tramitador.blocked" cols="12">
        <div class="text-bg-danger rounded-4 text-center p-2">
          <b>Usuario inactivo (bloqueado)</b>
        </div>
      </BCol>
    </BRow>
  </BPopover>
</template>

<style scoped lang="scss">
.list-group-item {
  --bs-list-group-item-padding-x: 0;
  --bs-list-group-border-width: 0;
  display: flex;
  gap: 12px;
  cursor: default;
  height: 30px;

  .text-gray-800 {
    color: var(--bs-gray-800);
  }

  .data {
    margin-bottom: 0 !important;
    flex-shrink: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>