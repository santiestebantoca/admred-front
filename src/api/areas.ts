import { api } from './client'

export const areasApi = {
  getAll: (params = {}) => api.get('/areas/areas', { params }).then(res => res.data),
  create: (data) => api.post('/areas/areas', data).then(res => res.data),
  delete: (id) => api.delete(`/areas/areas/${id}`).then(res => res.data),
  getById: (id) => api.get(`/areas/areas/${id}`).then(res => res.data),
  update: (id, data) => api.put(`/areas/areas/${id}`, data).then(res => res.data),
}
