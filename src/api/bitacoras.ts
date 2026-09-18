import { api } from './client'

export const bitacorasApi = {
  getAll: (params = {}) => api.get('/bitacoras/bitacoras', { params }).then(res => res.data),
}
