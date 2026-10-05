import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { tiposApi as api } from '@/api/tipos'
import { computed, toValue } from 'vue'

/**
 * Consulta de tipos de solicitud.
 *
 * @param params
 *   Parámetros del API (por ejemplo el `filtro` de `useTiposFiltro` y,
 *   opcionalmente, `page` y `limit`). Acepta un objeto plano, un `ref` o un
 *   `computed`.
 */
export function useTiposQuery(params = {}) {
  const { data, isPending, isLoading } = useQuery({
    key: () => queryKeys.tipos.lista(toValue(params)),
    query: () => api.getAll(toValue(params)),
    // Mientras se carga otra página o búsqueda se conserva el resultado
    // anterior: así la tabla y la paginación no "parpadean" ni pierden el total.
    placeholderData: (previousData) => previousData,
  })

  return {
    tipos: computed(() => data.value?.data),
    meta: computed(() => data.value?.meta),
    isPending,
    isLoading,
  }
}
