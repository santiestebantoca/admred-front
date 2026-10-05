import { api } from './client'

export const demandantesApi = {
  getAll: (params = {}) => api.get('/demandantes/demandantes', { params }).then(res => res.data),
}
