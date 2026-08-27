import { api } from './client'

export const tiposApi = {
  getAll: (params = {}) => api.get('/tipos/tipos', { params }).then(res => res.data),
}
