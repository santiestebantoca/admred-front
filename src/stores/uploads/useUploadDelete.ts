import { useMutation } from '@pinia/colada'
import { uploadsApi as api } from '@/api/uploads'

export function useUploadDelete() {

  return useMutation<any, number | string>({
    mutation: (deletedId) => api.delete(deletedId),
  })
}