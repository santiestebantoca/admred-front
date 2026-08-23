import { api } from './client'

export const solicitudesApi = {
  getAll: (params = {}) => api.get('/solicitudes/solicitudes', { params }).then(res => res.data),
}
