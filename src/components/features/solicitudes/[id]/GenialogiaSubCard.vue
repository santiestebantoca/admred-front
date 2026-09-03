<script setup>
const props = defineProps({
  solicitud: Object,
  go: Function
})
</script>

<template>
  <BListGroup :class="{ inicial: !solicitud.padre }">
    <BListGroupItem v-if="solicitud.padre" class="padre">
      <UIcon name="bi-circle-fill" />
      <div type="button" class="text-primary" @click="go(solicitud.padre.id)"
        v-tippy="`De: ${solicitud.padre.origen} / Para: ${solicitud.origen.nombre}`">
        {{ solicitud.padre.codigo }}
      </div>
    </BListGroupItem>
    <BListGroupItem class="actual">
      <UIcon name="bi-arrow-return-right" />
      <UIcon name="bi-circle-fill" />
      <div class="text-secondary">
        {{ solicitud.codigo }}
      </div>
      <span class="fw-semibold">(Actual)</span>
    </BListGroupItem>
    <BListGroupItem v-for="hijo in solicitud.hijos" class="hijo">
      <UIcon name="bi-arrow-return-right" />
      <UIcon name="bi-circle-fill" />
      <div type="button" class="text-primary" @click="go(hijo.id)" v-tippy="`Para: ${hijo.destino}`">
        {{ hijo.codigo }}
      </div>
      <span v-if="hijo.estado !== 'Terminado'" class="text-dark text-opacity-25">Pendiente</span>
      <UIcon v-else name="bi-check2" class="text-success top-50 translate-middle-y" />
    </BListGroupItem>
  </BListGroup>
</template>

<style scoped>
.list-group {
  --item-actual-svg-first-child-display: block;
  --item-hijo-padding-left: 30px;

  &.inicial {
    --item-actual-svg-first-child-display: none;
    --item-hijo-padding-left: 2px;
  }

  .list-group-item {
    --bs-list-group-item-padding-x: 2px;
    --bs-list-group-item-padding-y: 2px;
    --bs-list-group-border-width: 0;
    height: 30px;
    display: flex;
    gap: 12px;
    cursor: default;


    a {
      text-decoration: none;
    }

    svg {
      position: relative;
      margin-right: 0;
    }

    &.padre {
      svg {
        top: 9px;
        width: 10px;
        height: 10px;
        color: var(--bs-primary);
      }
    }

    &.actual {
      svg {
        &:first-child {
          top: 5px;
          left: 4px;
          color: var(--bs-primary);
          display: var(--item-actual-svg-first-child-display);
        }

        &:nth-child(2) {
          top: 9px;
          width: 10px;
          height: 10px;
          color: var(--bs-orange);
        }
      }
    }

    &.hijo {
      padding-left: var(--item-hijo-padding-left);

      svg {
        &:first-child {
          top: 5px;
          left: 4px;
          color: var(--bs-orange);
        }

        &:nth-child(2) {
          top: 9px;
          width: 10px;
          height: 10px;
          color: var(--bs-primary);
        }
      }

    }

  }
}
</style>
