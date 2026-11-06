import type { AxiosProgressEvent } from 'axios'
import { useMutation } from '@pinia/colada'
import { uploadsApi as api } from '@/api/uploads'
import type { UploadRow } from '@/types/backend'

type UploadPayload = {
  data: FormData
  onProgress?: (evento: AxiosProgressEvent) => void
}

export function useUploadCreate() {

  return useMutation<UploadRow, UploadPayload>({
    mutation: ({ data, onProgress }) => api.create(data, onProgress
      ? { onUploadProgress: onProgress }
      : undefined)
  })
}
