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
  consultadas: {
    getAll: (params = {}) => api.get('/reportes/areas_consultadas', { params }).then(res => res.data),
  },
  solicitudes: {
    raw: {
      getAll: (params = {}) => api.get('/reportes/solicitudes_raw', { params }).then(res => res.data),
    },
    externas: {
      getAll: (params = {}) => api.get('/reportes/solicitudes_externas', { params }).then(res => res.data),
    },
    internas: {
      getAll: (params = {}) => api.get('/reportes/solicitudes_internas', { params }).then(res => res.data),
    }
  },
}
