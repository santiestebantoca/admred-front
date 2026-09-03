import { useMutation } from '@pinia/colada'
import { uploadsApi as api } from '@/api/uploads'

export function useUploadCreate() {

  return useMutation({
    mutation: (newData) => api.create(newData)
  })
}