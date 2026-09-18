import { api } from './client'

export const tramitadoresApi = {
  getAll: (params = {}) => api.get('/tramitadores/tramitadores', { params }).then(res => res.data),
}
