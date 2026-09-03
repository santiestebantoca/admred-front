import { api } from './client'

export const uploadsApi = {
  create: (data) => api.post('/uploads/uploads', data).then(res => res.data),
  delete: (id) => api.delete(`/uploads/uploads/${id}`).then(res => res.data),
}
