import { api } from './client'

export const solicitudesApi = {
  getAll: (params = {}) => api.get('/solicitudes/solicitudes', { params }).then(res => res.data),
  create: (data) => api.post('/solicitudes/solicitudes', data).then(res => res.data),
  // delete: (id) => api.delete(`/plantillas/plantillas/${id}`).then(res => res.data),
  // getById: (id) => api.get(`/plantillas/plantillas/${id}`).then(res => res.data),
  // update: (id, data) => api.put(`/plantillas/plantillas/${id}`, data).then(res => res.data),
}
