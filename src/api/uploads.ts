import type { AxiosRequestConfig } from 'axios'
import { api } from './client'
import type { Id } from '@/types/api'
import type { UploadRow } from '@/types/backend'

export const uploadsApi = {
  create: (data: FormData, config?: AxiosRequestConfig) =>
    api.post<UploadRow>('/uploads/uploads', data, config).then(res => res.data),
  delete: (id: Id) =>
    api.delete<number>(`/uploads/uploads/${id}`).then(res => res.data),
}
