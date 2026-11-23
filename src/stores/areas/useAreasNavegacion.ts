import { useAreasQuery } from './useAreasQuery'
import { useAreaPropiaQuery } from './useAreaPropiaQuery'
import { nivelHijo } from './niveles'
import { useAuthQuery } from '@/stores/auth'
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
 * Estado de la navegación jerárquica de áreas.
 *
 * Carga todas las áreas una sola vez y construye el árbol en el cliente. El
 * navegador solo necesita los ids de la vista (`padre_id` y `nivel_id`), no
 * los nombres, para no depender de coincidencias de texto.
 *
 * El administrador AR navega desde los niveles raíz. El no AR navega desde su
 * propia área, que es la raíz de su ámbito y se muestra en solo lectura.
 */
export function useAreasNavegacion() {
  const {
    areas,
    isPending: areasPending,
    isLoading: areasLoading,
  } = useAreasQuery({})
  const { niveles, isPending: nivelesPending } = useNivelesQuery()
  const { authUser } = useAuthQuery()
  const { areaPropia } = useAreaPropiaQuery()

  const esAR = computed(() => !!authUser.value?.AR)
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
      if (!esAR.value) {
        return areaPropia.value
          ? [{
            tipo: 'area',
            area: areaPropia.value,
            hijas: hijosDe(areaPropia.value.id).length,
          }]
          : []
      }
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

  const areaDeContexto = computed(() => {
    const nodo = actual.value
    if (!nodo) return esAR.value ? undefined : areaPropia.value
    if (nodo.tipo === 'nivel') return undefined
    return (areas.value ?? []).find(item => item.id === nodo.areaId)
  })

  const puedeCrear = computed(() => {
    if (esAR.value) return true
    return !!nivelHijo(areaDeContexto.value?.nivel_id, niveles.value ?? [])
  })

  const entrarNivel = (nivelId: number) => {
    if (!esAR.value) return
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
    if (!nodo) {
      if (!esAR.value) {
        return areaPropia.value ? { padre: areaPropia.value.id } : {}
      }
      return {}
    }

    if (nodo.tipo === 'nivel') {
      return { nivel: nodo.nivelId, padre: null }
    }

    const area = (areas.value ?? []).find(item => item.id === nodo.areaId)
    if (!area) return {}

    if (!esAR.value) {
      return { padre: area.id }
    }

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
    esAR,
    actual,
    etiquetaActual,
    nivelesRaiz,
    entrarNivel,
    entrarArea,
    subir,
    hijosDe,
    contextoCrear,
    puedeCrear,
    nivelHijo: (nivelId: number | null | undefined) =>
      nivelHijo(nivelId, niveles.value ?? []),
    isPending,
    isLoading,
    totalAreas: computed(() => areas.value?.length ?? 0),
  }
}
