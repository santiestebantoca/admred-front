<script lang="ts" setup>
/**
 * Indicador de carga reutilizable.
 *
 * - En bloque (por defecto) reemplaza el contenido mientras se cargan datos.
 * - En línea (`inline`) sirve para refrescos parciales, pies de tabla, etc.
 *
 * El texto visible es el que anuncia el lector de pantalla: el spinner queda
 * oculto para accesibilidad y no se duplica el anuncio.
 */
withDefaults(defineProps<{
  texto?: string
  detalle?: string
  inline?: boolean
  centrado?: boolean
}>(), {
  texto: 'Cargando…',
  detalle: undefined,
  inline: false,
  centrado: true
})
</script>

<template>
  <component :is="inline ? 'span' : 'div'" class="indicador-carga"
    :class="[inline ? 'indicador-carga--inline' : '', centrado && !inline ? 'text-center py-5' : '']"
    role="status" aria-live="polite">
    <BSpinner :small="inline" class="indicador-carga__spinner" aria-hidden="true" />
    <span class="indicador-carga__texto">{{ texto }}</span>
    <span v-if="detalle && !inline" class="indicador-carga__detalle d-block small text-secondary mt-1">
      {{ detalle }}
    </span>
  </component>
</template>

<style scoped lang="scss">
.indicador-carga {
  color: var(--bs-secondary-color);

  &--inline {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    line-height: 1;
    vertical-align: middle;
  }
}

.indicador-carga__spinner {
  margin-right: 0.5rem;

  .indicador-carga--inline & {
    margin-right: 0;
  }
}

.indicador-carga__detalle {
  max-width: 40ch;
  margin-inline: auto;
}
</style>
