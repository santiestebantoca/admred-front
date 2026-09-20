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
import IBiFolder from '~icons/bi/folder'
import IBiInboxes from '~icons/bi/inboxes'
import IBiGraphUp from '~icons/bi/graph-up'
import IBiGear from '~icons/bi/gear'
import IBiBoxArrowRight from '~icons/bi/box-arrow-right'
import IBiPeople from '~icons/bi/people'
import IBiPerson from '~icons/bi/person'
import IBiForward from '~icons/bi/forward'
import IBiReply from '~icons/bi/reply'
import IBiPatchCheck from '~icons/bi/patch-check'
import IBiStar from '~icons/bi/star'
import IBiClockHistory from '~icons/bi/clock-history'
import IBiSticky from '~icons/bi/sticky'

const iconMap: Record<string, Component> = {
  'bi-folder': IBiFolder,
  'bi-inboxes': IBiInboxes,
  'bi-graph-up': IBiGraphUp,
  'bi-gear': IBiGear,
  'bi-box-arrow-right': IBiBoxArrowRight,
  'bi-people': IBiPeople,
  'bi-person': IBiPerson,
  'bi-forward': IBiForward,
  'bi-reply': IBiReply,
  'bi-patch-check': IBiPatchCheck,
  'bi-star': IBiStar,
  'bi-clock-history': IBiClockHistory,
  'bi-sticky': IBiSticky,
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
