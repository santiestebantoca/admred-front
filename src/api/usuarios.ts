import { api } from './client'

export const usuariosApi = {
  getAll: (params = {}) => api.get('/usuarios/usuarios', { params }).then(res => res.data),
  create: (data) => api.post('/usuarios/usuarios', data).then(res => res.data),
  delete: (id) => api.delete(`/usuarios/usuarios/${id}`).then(res => res.data),
  getById: (id) => api.get(`/usuarios/usuarios/${id}`).then(res => res.data),
  update: (id, data) => api.put(`/usuarios/usuarios/${id}`, data).then(res => res.data),
}
