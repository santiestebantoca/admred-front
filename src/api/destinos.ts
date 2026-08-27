import { api } from './client'

export const destinosApi = {
  getAll: (params = {}) => api.get('/destinos/destinos', { params }).then(res => res.data),
}
