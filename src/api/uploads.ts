import type { AxiosRequestConfig } from 'axios'
import { api } from './client'

export const uploadsApi = {
  create: (data: FormData, config?: AxiosRequestConfig) =>
    api.post('/uploads/uploads', data, config).then(res => res.data),
  delete: (id) => api.delete(`/uploads/uploads/${id}`).then(res => res.data),
}
