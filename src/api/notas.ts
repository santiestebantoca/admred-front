import { api } from './client'

export const notasApi = {
  create: (data) => api.post('/notas/notas', data).then(res => res.data),
  getAll: (params = {}) => api.get('/notas/notas', { params }).then(res => res.data),
}
