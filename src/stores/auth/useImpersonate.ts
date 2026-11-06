import { useMutation } from '@pinia/colada'
import { authApi as api } from '@/api/auth'
import type { AuthUser, Id } from '@/types/api'

export function useImpersonate() {

  return useMutation<AuthUser | null, Id>({
    mutation: (userId = 0) => api.impersonate(userId),

    onSuccess: () => {
      window.location.reload()
    }
  })
}
