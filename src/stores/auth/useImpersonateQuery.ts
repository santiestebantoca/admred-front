import { useQuery, defineQuery } from '@pinia/colada'
import { authApi as api } from '@/api/auth'
import { queryKeys } from '@/lib/query-keys'
import { useAuthQuery } from '@/stores/auth'
import { ref, computed } from 'vue'

export const useImpersonateQuery = defineQuery(() => {
  const { authUser } = useAuthQuery()
  const search = ref('')
  const isFiltered = computed(() => search.value?.length >= 2)

  const { data, isLoading } = useQuery({
    key: () => [...queryKeys.usuarios.lista({ search: search.value })],
    query: () => api.getImpersonateables({ search: search.value }),
    enabled: () => search.value?.length >= 2,
  })

  const users = computed(() => data.value?.map(d => ({
    ...d,
    actual: d.id === authUser.value?.id
  })))

  return {
    users,
    isLoading,
    search,
    isFiltered
  }
})