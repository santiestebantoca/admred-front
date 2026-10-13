import { api } from './client'

export const nivelesApi = {
  getAll: (params = {}) => api.get('/niveles/niveles', { params }).then(res => res.data),
}
