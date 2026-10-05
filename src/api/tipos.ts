import { api } from './client'

export const tiposApi = {
  getAll: (params = {}) => api.get('/tipos/tipos', { params }).then(res => res.data),
  create: (data) => api.post('/tipos/tipos', data).then(res => res.data),
  delete: (id) => api.delete(`/tipos/tipos/${id}`).then(res => res.data),
  getById: (id) => api.get(`/tipos/tipos/${id}`).then(res => res.data),
  update: (id, data) => api.put(`/tipos/tipos/${id}`, data).then(res => res.data),

}
