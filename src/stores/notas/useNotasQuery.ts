import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { notasApi as api } from '@/api/notas'
import { formatHM, formatDate } from '@/composables/useDates'
import { Nota } from '@/types/models'
import { computed, toValue } from 'vue'

type NotaConHora = Nota & {
  hora: string,
}

export function useNotasQuery(solicitudId?: number | string) {

  const { data: _data, isPending } = useQuery<Nota[]>({
    key: () => queryKeys.notas.lista({ solicitudId: toValue(solicitudId) }),
    query: () => api.getAll({ solicitudId: toValue(solicitudId) }),
    enabled: () => !!toValue(solicitudId),
    // staleTime: Infinity
  })

  const notas = computed(() => {
    const items = (_data.value || []) as Nota[]
    const out: Record<string, NotaConHora[]> = {}
    for (const it of items) {
      const key = formatDate(it.fecha) ?? ''
      if (!out[key]) out[key] = []
      out[key].push({ ...it, hora: formatHM(it.fecha) })
    }
    return out
  })

  return {
    notas,
    isPending,
  }
}
