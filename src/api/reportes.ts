import { api } from './client'

export const reportesApi = {
  pendientes: {
    getAll: (params = {}) => api.get('/reportes/pendientes_del_area', { params }).then(res => res.data),
  },
  personas: {
    getAll: (params = {}) => api.get('/reportes/indicadores_del_usuario', { params }).then(res => res.data),
  },
  codigos: {
    getAll: (params = {}) => api.get('/reportes/buscar_codigo', { params }).then(res => res.data),
  },
  solicitudes: {
    getAll: (params = {}) => api.get('/reportes/solicitudes', { params }).then(res => res.data),
  },
}
