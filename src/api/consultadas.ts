import { api } from './client'

export const consultadasApi = {
  getAll: (params = {}) => api.get('/consultadas/consultadas', { params }).then(res => res.data),
}
