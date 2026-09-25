<script setup>
import { computed } from 'vue'

const props = defineProps({
  me: { type: Object, required: true },
  indice: { type: Map, default: () => new Map() },
  editable: { type: Boolean, default: false },
  root: { type: Boolean, default: false },
})

/** El backend marca la raíz del recorrido con `root`; el prop permite forzarlo. */
const esRoot = computed(() => props.root || !!props.me.root)
const terminada = computed(() => props.me.estado === 4)
const habilitada = computed(() => esRoot.value || props.editable)

/** Las hijas llegan como ids; se resuelven contra el índice del árbol. */
const hijas = computed(() =>
  (props.me.children ?? []).map(id => props.indice.get(id)).filter(Boolean)
)
</script>

<template>
  <div class="nodo" :class="{ 'nodo--root': esRoot }">
    <BButton variant="link" class="nodo__codigo" :class="{ terminada }" :to="{ query: { item: me.id } }"
      :disabled="!habilitada" v-text="me.codigo" />
    <div v-if="hijas.length" class="nodo__hijas">
      <Nodo v-for="hija in hijas" :key="hija.id" :me="hija" :indice="indice" :editable="editable" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.nodo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.nodo__hijas {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: .5rem;
  padding-left: .75rem;
  border-left: 1px solid var(--bs-gray-300);
}

.nodo__codigo {
  --bs-btn-padding-x: 0;
  --bs-btn-padding-y: .1875rem;

  &::before {
    content: "→ ";
    color: var(--bs-secondary);
    margin-right: .3em;
  }

  &.terminada::after {
    content: " \2713";
    margin-left: .3em;
    color: var(--bs-success);
  }
}

.nodo--root>.nodo__codigo::before {
  content: "• ";
}
</style>
