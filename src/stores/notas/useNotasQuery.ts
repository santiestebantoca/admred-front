import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { notasApi as api } from '@/api/notas'
import { formatHM, formatDate } from '@/composables/useDates'
import { Nota } from '@/types/models'
import { ref, computed } from 'vue'

type NotaConHora = Nota & {
  hora: string,
}

export function useNotasQuery(_solicitudId?: number | string) {
  const solicitudId = ref(_solicitudId)

  const { data: _data, isPending } = useQuery<Nota[]>({
    key: () => queryKeys.notas.lista({ solicitudId: solicitudId.value }),
    query: () => api.getAll({ solicitudId: solicitudId.value }),
    enabled: () => !!solicitudId.value,
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
    solicitudId
  }
}
