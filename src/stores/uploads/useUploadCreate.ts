import type { AxiosProgressEvent } from 'axios'
import { useMutation } from '@pinia/colada'
import { uploadsApi as api } from '@/api/uploads'

type UploadPayload = {
  data: FormData
  onProgress?: (evento: AxiosProgressEvent) => void
}

export function useUploadCreate() {

  return useMutation<any, UploadPayload>({
    mutation: ({ data, onProgress }) => api.create(data, onProgress
      ? { onUploadProgress: onProgress }
      : undefined)
  })
}
