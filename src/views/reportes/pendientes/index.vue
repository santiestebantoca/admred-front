<script setup>
import Nodo from '@/components/features/reportes/pendientes/Nodo.vue'
import { usePendientesQuery } from '@/stores/reportes'
import { useAuthQuery } from '@/stores/auth'
import { computed, inject } from 'vue'

const title = inject('page:title')
const { pendientes, isPending } = usePendientesQuery()
const { authUser } = useAuthQuery()
const editable = computed(() => !!authUser.value?.AR)
const arboles = computed(() =>
  (pendientes.value ?? [])
    .map(nodos => ({
      root: nodos.find(nodo => nodo.root) ?? nodos[0],
      indice: new Map(nodos.map(nodo => [nodo.id, nodo])),
    }))
    .filter(arbol => arbol.root)
)

title.value = 'Mis pendientes'
</script>

<template>
  <div class="pt-3">
    <p>Esquema de solicitudes pendientes enviadas por mi área.</p>
    <div v-if="isPending" class="my-5 py-5 text-center">
      <BSpinner />
    </div>
    <em v-else-if="!pendientes.length" class="text-muted">
      No hay pendientes
    </em>
    <div v-else class="esquema">
      <div v-for="(arbol, i) in arboles" :key="arbol.root.id" class="franja" :class="{ 'franja--alterna': i % 2 }">
        <Nodo :me="arbol.root" :indice="arbol.indice" :editable="editable" root />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.esquema {
  display: flex;
  flex-direction: column;
  gap: .25rem;
}

.franja {
  padding: .25rem .5rem;
  border-radius: var(--bs-border-radius);

  &--alterna {
    background-color: var(--bs-gray-100);
  }
}
</style>
