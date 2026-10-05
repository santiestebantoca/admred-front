<script lang="ts" setup>
/**
 * Icono dinámico.
 *
 * Vía recomendada (documentación de bootstrap-vue-next + unplugin-icons): la etiqueta
 * estática auto-importada, `<IBiSearch />` o `<ILucidePlus />`, sin importar nada. Se
 * resuelve en compilación y se tree-shakea, pero NO admite nombres dinámicos: el resolver
 * de unplugin-vue-components genera los `import` durante la compilación y no registra
 * componentes globales, por lo que `<component :is="'IBiSearch'" />` falla.
 *
 * Este componente cubre solo esos casos puntuales en que el nombre viene de datos
 * (composables, `v-for`, etc.). El mapa de abajo es intencionalmente mínimo: al ser
 * imports estáticos, `<component :is>` recibe un componente y no una cadena.
 *
 * Para añadir un icono dinámico nuevo, regístralo aquí.
 */
import type { Component } from 'vue'
import { computed } from 'vue'
import ILucideLandPlot from '~icons/lucide/land-plot'
import ILucideTag from '~icons/lucide/tag'
import ILucideUsers from '~icons/lucide/users'
import ILucideFolder from '~icons/lucide/folder'
import ILucideChartLine from '~icons/lucide/chart-line'
import ILucideSettings from '~icons/lucide/settings'
import ILucideOctagonAlert from '~icons/lucide/octagon-alert'
import ILucideSquareArrowRightEnter from '~icons/lucide/square-arrow-right-enter'
import ILucideSquareArrowRight from '~icons/lucide/square-arrow-right'
import ILucideShuffle from '~icons/lucide/shuffle'
import ILucideSearch from '~icons/lucide/search'
import ILucideDatabase from '~icons/lucide/database'
import ILucideCheckCheck from '~icons/lucide/check-check'
import ILucideStar from '~icons/lucide/star'
import ILucideClockFading from '~icons/lucide/clock-fading'
import ILucideStickyNote from '~icons/lucide/sticky-note'
import ILucideForward from '~icons/lucide/forward'
import ILucideReply from '~icons/lucide/reply'

const iconMap: Record<string, Component> = {
  'lucide-users': ILucideUsers,
  'lucide-tag': ILucideTag,
  'lucide-land-plot': ILucideLandPlot,
  'lucide-folder': ILucideFolder,
  'lucide-chart-line': ILucideChartLine,
  'lucide-settings': ILucideSettings,
  'lucide-octagon-alert': ILucideOctagonAlert,
  'lucide-square-arrow-right-enter': ILucideSquareArrowRightEnter,
  'lucide-square-arrow-right': ILucideSquareArrowRight,
  'lucide-shuffle': ILucideShuffle,
  'lucide-search': ILucideSearch,
  'lucide-database': ILucideDatabase,
  'lucide-check-check': ILucideCheckCheck,
  'lucide-star': ILucideStar,
  'lucide-clock-fading': ILucideClockFading,
  'lucide-sticky-note': ILucideStickyNote,
  'lucide-forward': ILucideForward,
  'lucide-reply': ILucideReply,
}

const props = defineProps<{ name?: string }>()

const icon = computed(() => {
  if (!props.name) return undefined
  if (!iconMap[props.name] && import.meta.env.DEV) {
    console.warn(
      `[UIcon] Icono "${props.name}" no registrado. Usa la etiqueta estática ` +
      `(<IBiSearch />, <ILucidePlus />, ...) o agrégalo al mapa de UIcon.vue.`,
    )
  }
  return iconMap[props.name]
})
</script>

<template>
  <component :is="icon" v-if="icon" />
</template>
