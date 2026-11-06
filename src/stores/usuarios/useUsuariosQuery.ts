import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { usuariosApi as api } from '@/api/usuarios'
import type {
  ListResponse,
  MetaListado,
  UsuarioListaItem,
  UsuariosParams,
} from '@/types/api'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

/**
 * Consulta de usuarios del sistema.
 *
 * @param params
 *   Parámetros del API (por ejemplo el `filtro` de `useUsuariosFiltro` y,
 *   opcionalmente, `page` y `limit`). Acepta un objeto plano, un `ref` o un
 *   `computed`.
 */
export function useUsuariosQuery(params: MaybeRefOrGetter<UsuariosParams> = {}) {
  const { data, isPending, isLoading } = useQuery<ListResponse<UsuarioListaItem>>({
    key: () => queryKeys.usuarios.lista(toValue(params)),
    query: () => api.getAll(toValue(params)),
    // Mientras se carga otra página o búsqueda se conserva el resultado
    // anterior: así la tabla y la paginación no "parpadean" ni pierden el total.
    placeholderData: (previousData) => previousData,
  })

  return {
    usuarios: computed(() => data.value?.data),
    meta: computed<MetaListado | undefined>(() => data.value?.meta),
    isPending,
    isLoading,
  }
}
