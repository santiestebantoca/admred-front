<script lang="ts" setup>
/**
 * Botón para acciones que envían datos al servidor.
 *
 * Centraliza el comportamiento que antes se repetía en cada formulario:
 * - muestra el spinner y un texto de progreso localizado;
 * - se deshabilita mientras la operación está en curso, evitando envíos
 *   duplicados por doble clic;
 * - anuncia el estado a las tecnologías de asistencia con `aria-busy`.
 *
 * El resto de props, clases y eventos se reenvían a `BButton`.
 */
defineOptions({ inheritAttrs: false })

withDefaults(defineProps<{
  loading?: boolean
  disabled?: boolean
  textoCargando?: string
}>(), {
  loading: false,
  disabled: false,
  textoCargando: 'Procesando…'
})
</script>

<template>
  <BButton v-bind="$attrs" :loading="loading" :disabled="disabled || loading"
    :loading-text="textoCargando" :aria-busy="loading ? 'true' : undefined">
    <slot />
  </BButton>
</template>
