// stores/authImpersonate.js
import { useMutation } from '@pinia/colada'
import { authApi as api } from '@/api/auth'

export function useImpersonate() {

  return useMutation<unknown, number>({
    mutation: (userId = 0) => api.impersonate(userId),

    onSuccess: (data, variables, context) => {
      window.location.reload()
    }
  })
}