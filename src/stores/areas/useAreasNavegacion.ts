import { useAreasQuery } from './useAreasQuery'
import { useNivelesQuery } from '@/stores/niveles'
import type { AreaListaItem } from '@/types/api'
import type { NivelRow } from '@/types/backend'
import { computed, ref } from 'vue'

/** Valores que el navegador envía al formulario de alta. */
export type ContextoCrearArea = { nivel?: number; padre?: number | null }

/** Nodo de la pila de navegación: un nivel raíz o un área concreta. */
export type NodoNavegacion =
  | { tipo: 'nivel'; nivelId: number; label: string }
  | { tipo: 'area'; areaId: number; label: string }

/** Fila que pinta el navegador, ya sea un nivel de la raíz o un área. */
export type FilaNavegacion =
  | { tipo: 'nivel'; id: number; nombre: string; total: number }
  | { tipo: 'area'; area: AreaListaItem; hijas: number }

const ordenarPorNombre = (a: AreaListaItem, b: AreaListaItem) =>
  (a.nombre ?? '').localeCompare(b.nombre ?? '', 'es', { sensitivity: 'base' })

/**
 * Nivel que corresponde a las hijas de un área.
 *
 * El nivel 5 es autorrecursivo: sus hijas también son de nivel 5. El resto
 * sigue el `padre_id` del catálogo de niveles.
 */
export function nivelHijo(
  nivelId: number | null | undefined,
  niveles: NivelRow[],
) {
  if (!nivelId) return undefined
  if (nivelId === 5) return 5
  return niveles.find(nivel => nivel.padre_id === nivelId)?.id
}

/**
 * Niveles que pueden aparecer como padre de un área del nivel indicado.
 *
 * El nivel 5 acepta padres de nivel 4 y de nivel 5. El resto sigue el
 * `padre_id` del catálogo. Los niveles raíz devuelven una lista vacía.
 */
export function nivelesPadreDe(
  nivelId: number | null | undefined,
  niveles: NivelRow[],
) {
  if (!nivelId) return []
  if (nivelId === 5) return [4, 5]
  const nivel = niveles.find(item => item.id === nivelId)
  return nivel?.padre_id ? [nivel.padre_id] : []
}

/**
 * Estado de la navegación jerárquica de áreas.
 *
 * Carga todas las áreas una sola vez y construye el árbol en el cliente. El
 * navegador solo necesita los ids de la vista (`padre_id` y `nivel_id`), no
 * los nombres, para no depender de coincidencias de texto.
 */
export function useAreasNavegacion() {
  const {
    areas,
    isPending: areasPending,
    isLoading: areasLoading,
  } = useAreasQuery({})
  const { niveles, isPending: nivelesPending } = useNivelesQuery()

  const nodos = ref<NodoNavegacion[]>([])

  const nivelesRaiz = computed(() =>
    [...(niveles.value ?? [])]
      .filter(nivel => !nivel.padre_id)
      .sort((a, b) => a.id - b.id)
  )

  const nivelPorId = computed(() =>
    new Map<number, NivelRow>(
      (niveles.value ?? []).map(nivel => [nivel.id, nivel] as [number, NivelRow]),
    )
  )

  const areasPorNivel = computed(() => {
    const mapa = new Map<number, AreaListaItem[]>()
    for (const area of areas.value ?? []) {
      if (area.nivel_id == null) continue
      const lista = mapa.get(area.nivel_id) ?? []
      lista.push(area)
      mapa.set(area.nivel_id, lista)
    }
    for (const lista of mapa.values()) lista.sort(ordenarPorNombre)
    return mapa
  })

  const areasPorPadre = computed(() => {
    const mapa = new Map<number, AreaListaItem[]>()
    for (const area of areas.value ?? []) {
      if (area.padre_id == null) continue
      const lista = mapa.get(area.padre_id) ?? []
      lista.push(area)
      mapa.set(area.padre_id, lista)
    }
    for (const lista of mapa.values()) lista.sort(ordenarPorNombre)
    return mapa
  })

  const actual = computed(() => nodos.value[nodos.value.length - 1])

  const hijosDe = (areaId: number) =>
    (areasPorPadre.value.get(areaId) ?? []).filter(area => area.id !== areaId)

  const filas = computed<FilaNavegacion[]>(() => {
    const nodo = actual.value
    if (!nodo) {
      return nivelesRaiz.value.map(nivel => ({
        tipo: 'nivel',
        id: nivel.id,
        nombre: nivel.nombre,
        total: areasPorNivel.value.get(nivel.id)?.length ?? 0,
      }))
    }

    const areasDelNodo = nodo.tipo === 'nivel'
      ? areasPorNivel.value.get(nodo.nivelId) ?? []
      : hijosDe(nodo.areaId)

    return areasDelNodo.map(area => ({
      tipo: 'area',
      area,
      hijas: hijosDe(area.id).length,
    }))
  })

  const breadcrumb = computed(() => [
    { label: 'Áreas', tipo: 'raiz' as const },
    ...nodos.value.map(nodo => ({ label: nodo.label, tipo: nodo.tipo })),
  ])

  const esRaiz = computed(() => !actual.value)

  const etiquetaActual = computed(() => actual.value?.label)

  const entrarNivel = (nivelId: number) => {
    const nivel = nivelPorId.value.get(nivelId)
    if (!nivel) return
    nodos.value.push({ tipo: 'nivel', nivelId, label: nivel.nombre })
  }

  const entrarArea = (areaId: number) => {
    const area = (areas.value ?? []).find(item => item.id === areaId)
    if (!area) return
    nodos.value.push({
      tipo: 'area',
      areaId,
      label: area.nombre ?? `Área ${areaId}`,
    })
  }

  const subir = () => {
    nodos.value.pop()
  }

  const contextoCrear = computed<ContextoCrearArea>(() => {
    const nodo = actual.value
    if (!nodo) return {}
    if (nodo.tipo === 'nivel') {
      return { nivel: nodo.nivelId, padre: null }
    }

    const area = (areas.value ?? []).find(item => item.id === nodo.areaId)
    if (!area) return {}

    return {
      nivel: nivelHijo(area.nivel_id, niveles.value ?? []),
      padre: area.id,
    }
  })

  const isPending = computed(() => areasPending.value || nivelesPending.value)
  const isLoading = computed(() => areasLoading.value)

  return {
    nodos,
    filas,
    breadcrumb,
    esRaiz,
    actual,
    etiquetaActual,
    nivelesRaiz,
    entrarNivel,
    entrarArea,
    subir,
    hijosDe,
    contextoCrear,
    nivelHijo: (nivelId: number | null | undefined) =>
      nivelHijo(nivelId, niveles.value ?? []),
    isPending,
    isLoading,
    totalAreas: computed(() => areas.value?.length ?? 0),
  }
}
