import { useQuery, defineQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { solicitudesApi as api } from '@/api/solicitudes'
import { ref, computed } from 'vue'

export const useSolicitudesQuery = defineQuery(() => {
  const params = ref(undefined)

  const validParams = computed(() => ({
    tray: params.value?.tray,
    state: params.value?.state,
    ...params.value?.status === undefined ? {} : { status: params.value.status },
    ...params.value?.period === undefined ? {} : { period: params.value.period },
    ...params.value?.search === undefined ? {} : { search: params.value.search },
  }))

  const { data, isPending, isLoading, refresh } = useQuery({
    key: () => queryKeys.solicitudes.lista(validParams.value),
    query: () => api.getAll(validParams.value),
    enabled: () => params.value?.tray && params.value?.state,
  })

  const isFiltered = computed(() => {
    if (!params.value) return false
    const requiredKeys = ['tray', 'state']
    const allKeys = Object.keys(params.value)
    const extraKeys = allKeys.filter(key =>
      !requiredKeys.includes(key) && params.value![key] !== undefined
    )
    return extraKeys.length > 0
  })

  return {
    solicitudes: computed(() => data.value?.data),
    total: computed(() => data.value?.total),
    tray: computed(() => params.value?.tray),
    state: computed(() => params.value?.state),
    search: computed(() => params.value?.search),
    isPending,
    isLoading,
    refresh,
    params,
    isFiltered,
    validParams
  }
})