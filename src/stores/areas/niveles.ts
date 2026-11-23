import type { NivelRow } from '@/types/backend'

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
