import { useMutation } from '@pinia/colada'
import { uploadsApi as api } from '@/api/uploads'
import type { Id } from '@/types/api'

export function useUploadDelete() {

  return useMutation<number, Id>({
    mutation: (deletedId) => api.delete(deletedId),
  })
}
