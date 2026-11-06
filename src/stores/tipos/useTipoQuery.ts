import { useQuery } from '@pinia/colada'
import { tiposApi as api } from '@/api/tipos'
import { queryKeys } from '@/lib/query-keys'
import type { Id } from '@/types/api'
import type { TipoDetalle } from '@/types/models'
import { toValue, type MaybeRefOrGetter } from 'vue'

export function useTipoQuery(tipoId?: MaybeRefOrGetter<Id>) {

  const { data, isPending } = useQuery<TipoDetalle>({
    key: () => queryKeys.tipos.detalle(toValue(tipoId)),
    query: () => api.getById(toValue(tipoId)),
    enabled: () => !!toValue(tipoId),
  })

  return {
    tipo: data,
    isPending,
  }
}
