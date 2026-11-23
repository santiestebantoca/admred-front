import { useAreasQuery } from './useAreasQuery'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

const ordenarPorNombre = (
  a: { nombre: string | null },
  b: { nombre: string | null },
) => (a.nombre ?? '').localeCompare(b.nombre ?? '', 'es', { sensitivity: 'base' })

/**
 * Opciones de área padre para los formularios y el filtro.
 *
 * Se apoya en la consulta general de áreas (la misma que usa el navegador),
 * de modo que abrir un formulario no genera una petición adicional si el
 * navegador ya cargó el catálogo. El nivel 5 puede tener padres de nivel 4 y
 * de nivel 5, por eso recibe una lista de niveles.
 */
export function useAreasPadresQuery(
  niveles: MaybeRefOrGetter<number[]>,
) {
  const { areas, isPending, isLoading } = useAreasQuery({})

  const padres = computed(() => {
    const ids = new Set(toValue(niveles))
    if (!ids.size) return []
    return [...(areas.value ?? [])]
      .filter(area => area.nivel_id != null && ids.has(area.nivel_id))
      .sort(ordenarPorNombre)
  })

  const options = computed(() => padres.value.map(area => ({
    value: area.id,
    text: area.nombre ?? `Área ${area.id}`,
  })))

  return {
    padres,
    options,
    isPending,
    isLoading,
  }
}
