import { useAreasFiltro } from './useAreasFiltro'
import { useAreasQuery } from './useAreasQuery'
import { computed, ref, watch } from 'vue'

const LIMIT_DEFAULT = 10
const LIMITS = [10, 25, 50, 100]

/**
 * Estado de la lista de areas del admin: filtros + paginación del servidor.
 *
 * Es el estado local de la interfaz (no un store): se crea al montar la lista,
 * de modo que montar otra lista no lo comparte ni lo pisa.
 */
export function useAreasLista() {
  const { search, nombre, padre, nivel, rol_key, filtro, isFiltered, reset: resetFiltro } = useAreasFiltro()

  // Paginación (la resuelve el servidor)
  const page = ref(1)
  const limit = ref(LIMIT_DEFAULT)

  // Al cambiar un filtro se vuelve a la primera página. `sync` para que la
  // página ya esté actualizada cuando se recalcule la clave de la consulta
  // (evita una petición con la página anterior).
  watch(filtro, () => (page.value = 1), { flush: 'sync' })

  // Filtros + paginación: es lo que espera el API (`page`, `limit`)
  const params = computed(() => ({
    ...filtro.value,
    page: page.value,
    limit: limit.value,
  }))

  const { areas, meta, isPending, isLoading } = useAreasQuery(params)

  const total = computed(() => meta.value?.total ?? 0)

  const reset = () => {
    resetFiltro()
    page.value = 1
  }

  return {
    nombre,
    padre,
    nivel,
    rol_key,
    search,
    isFiltered,
    page,
    limit,
    limits: LIMITS,
    areas,
    isPending,
    isLoading,
    total,
    reset,
  }
}
