import { api } from './client'

export const notificacionesApi = {
  getAll: (params = {}) => api.get('/notificaciones/notificaciones', { params }).then(res => res.data),
}
