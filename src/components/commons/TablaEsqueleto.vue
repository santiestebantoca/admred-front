<script lang="ts" setup>
/**
 * Esqueleto de tabla para la carga inicial de listados.
 *
 * Mantiene la estructura visual de la tabla mientras llegan los datos, en
 * lugar de colapsar el contenido a un spinner. El texto para lectores de
 * pantalla se anuncia una sola vez.
 */
import { BPlaceholder } from 'bootstrap-vue-next'

withDefaults(defineProps<{
  filas?: number
  columnas?: number
  texto?: string
}>(), {
  filas: 6,
  columnas: 3,
  texto: 'Cargando datos…'
})

const anchos = ['92%', '78%', '64%', '86%', '52%', '70%', '44%']

const ancho = (fila: number, columna: number) => anchos[(fila * 2 + columna) % anchos.length]
</script>

<template>
  <div class="tabla-esqueleto" role="status" aria-live="polite">
    <div class="tabla-esqueleto__fila tabla-esqueleto__fila--cabecera"
      :style="{ '--columnas': columnas }" aria-hidden="true">
      <BPlaceholder v-for="columna in columnas" :key="`cabecera-${columna}`" animation="glow"
        :width="columna === 1 ? '42%' : '66%'" />
    </div>
    <div v-for="fila in filas" :key="fila" class="tabla-esqueleto__fila"
      :style="{ '--columnas': columnas }" aria-hidden="true">
      <BPlaceholder v-for="columna in columnas" :key="`${fila}-${columna}`" animation="wave"
        :width="ancho(fila, columna)" />
    </div>
    <span class="visually-hidden">{{ texto }}</span>
  </div>
</template>

<style scoped lang="scss">
.tabla-esqueleto {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.tabla-esqueleto__fila {
  display: grid;
  grid-template-columns: repeat(var(--columnas), minmax(0, 1fr));
  gap: 1rem;
  align-items: center;
  padding: 0.65rem 0.5rem;
  border-bottom: 1px solid var(--bs-border-color);

  &--cabecera {
    border-bottom-width: 2px;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
}
</style>
