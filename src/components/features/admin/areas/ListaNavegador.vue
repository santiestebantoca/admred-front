<script lang="ts" setup>
const modo = defineModel<'lista' | 'navegar'>('modo', { default: 'lista' })

import ModoConmutador from './ModoConmutador.vue'
import IndicadorCarga from '@/components/commons/IndicadorCarga.vue'
import { useAreasNavegacion } from '@/stores/areas'
import type { ContextoCrearArea } from '@/stores/areas'
import type { AreaListaItem } from '@/types/api'
import type { RouteLocationRaw } from 'vue-router'
import { computed, inject, type Ref } from 'vue'

const linkCrear = inject<Ref<((contexto?: ContextoCrearArea) => RouteLocationRaw) | undefined>>('admin:areas:linkCrear')
const setAreaId = inject<Ref<((areaId: number) => void) | undefined>>('admin:areas:setAreaId')

const {
  filas,
  breadcrumb,
  esRaiz,
  actual,
  subir,
  entrarNivel,
  entrarArea,
  contextoCrear,
  isPending,
  isLoading,
} = useAreasNavegacion()

const vacioTexto = computed(() => {
  if (esRaiz.value) return 'No hay niveles configurados.'
  return actual.value?.tipo === 'nivel'
    ? 'No hay áreas en este nivel.'
    : 'Esta área no tiene áreas hijas.'
})

const abrirDetalle = (area: AreaListaItem) => setAreaId.value?.(area.id)

const textoTotal = (total: number) => `${total} ${total === 1 ? 'área' : 'áreas'}`
</script>

<template>
  <div>
    <div class="hstack flex-wrap align-items-center gap-2 mb-3">
      <ModoConmutador v-model="modo" />
      <BButton :to="linkCrear?.(contextoCrear)" class="ms-auto">
        <ILucidePlus /> Agregar
      </BButton>
    </div>

    <nav v-if="!isPending" aria-label="Ruta de áreas" class="mb-3 max-w-700">
      <ol class="breadcrumb mb-0">
        <li v-for="(nodo, index) in breadcrumb" :key="`${nodo.tipo}-${index}`" class="breadcrumb-item"
          :class="{ active: index === breadcrumb.length - 1 }"
          :aria-current="index === breadcrumb.length - 1 ? 'page' : undefined">
          {{ nodo.label }}
        </li>
      </ol>
    </nav>

    <IndicadorCarga v-if="isPending" texto="Cargando áreas…" detalle="Un momento por favor." />
    <div v-else class="position-relative max-w-700" :aria-busy="isLoading">
      <div v-if="isLoading" class="indicador-actualizacion">
        <IndicadorCarga inline texto="Actualizando…" />
      </div>

      <BListGroup class="areas-nav">
        <BListGroupItem v-if="!esRaiz" class="areas-nav-item p-0">
          <button type="button" class="areas-nav-main" @click="subir">
            <ILucideArrowUp class="text-secondary" />
            <span class="flex-fill text-start">ir al nivel superior</span>
          </button>
        </BListGroupItem>

        <BListGroupItem v-if="!filas.length" class="areas-nav-empty">
          {{ vacioTexto }}
        </BListGroupItem>

        <BListGroupItem v-for="fila in filas"
          :key="fila.tipo === 'nivel' ? `nivel-${fila.id}` : `area-${fila.area.id}`"
          class="areas-nav-item p-0">
          <template v-if="fila.tipo === 'nivel'">
            <button type="button" class="areas-nav-main" @click="entrarNivel(fila.id)">
              <ILucideFolder class="text-warning" />
              <span class="flex-fill text-start">{{ fila.nombre }}</span>
              <small class="text-muted">{{ textoTotal(fila.total) }}</small>
            </button>
          </template>
          <template v-else>
            <button type="button" class="areas-nav-main" @click="abrirDetalle(fila.area)">
              <span class="flex-fill text-start">{{ fila.area.nombre }}</span>
            </button>
            <BButton v-if="fila.hijas > 0" type="button" variant="flat" class="areas-nav-folder me-1"
              :aria-label="`Ver áreas hijas de ${fila.area.nombre}`" @click.stop="entrarArea(fila.area.id)">
              <ILucideFolder />
            </BButton>
          </template>
        </BListGroupItem>
      </BListGroup>
    </div>
  </div>
</template>

<style scoped lang="scss">
.areas-nav {
  --bs-list-group-border-color: var(--bs-border-color);
  border-radius: var(--bs-border-radius-lg);
  overflow: hidden;
}

.areas-nav-item {
  display: flex;
  align-items: stretch;
  padding: 0;
}

.areas-nav-main {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .75rem 1rem;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;

  &:hover {
    background: var(--bs-tertiary-bg);
  }

  &:focus-visible {
    outline: 2px solid var(--bs-primary);
    outline-offset: -2px;
  }
}

.areas-nav-folder {
  align-self: center;
  margin-right: .5rem;
}

.areas-nav-empty {
  padding: 1rem;
  color: var(--bs-secondary-color);
  text-align: center;
}
</style>
