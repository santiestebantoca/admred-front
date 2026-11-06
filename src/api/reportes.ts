import { api } from './client'
import type {
  ReporteAreaConsultadaRow,
  ReporteCodigoRow,
  ReportePersonaRow,
  ReportePendientesResponse,
  ReporteSolicitudRawRow,
  ReporteSolicitudRow,
  ReportesAreasConsultadasParams,
  ReportesCodigosParams,
  ReportesPersonasParams,
  ReportesSolicitudesExternasParams,
  ReportesSolicitudesInternasParams,
  ReportesSolicitudesRawParams,
} from '@/types/api'

export const reportesApi = {
  pendientes: {
    getAll: () =>
      api.get<ReportePendientesResponse>('/reportes/pendientes_del_area').then(res => res.data),
  },
  personas: {
    getAll: (params: ReportesPersonasParams) =>
      api.get<ReportePersonaRow[]>('/reportes/indicadores_del_usuario', { params }).then(res => res.data),
  },
  codigos: {
    getAll: (params: ReportesCodigosParams) =>
      api.get<ReporteCodigoRow[]>('/reportes/buscar_codigo', { params }).then(res => res.data),
  },
  consultadas: {
    getAll: (params: ReportesAreasConsultadasParams) =>
      api.get<ReporteAreaConsultadaRow[]>('/reportes/areas_consultadas', { params }).then(res => res.data),
  },
  solicitudes: {
    raw: {
      getAll: (params: ReportesSolicitudesRawParams) =>
        api.get<ReporteSolicitudRawRow[]>('/reportes/solicitudes_raw', { params }).then(res => res.data),
    },
    externas: {
      getAll: (params: ReportesSolicitudesExternasParams) =>
        api.get<ReporteSolicitudRow[]>('/reportes/solicitudes_externas', { params }).then(res => res.data),
    },
    internas: {
      getAll: (params: ReportesSolicitudesInternasParams) =>
        api.get<ReporteSolicitudRow[]>('/reportes/solicitudes_internas', { params }).then(res => res.data),
    },
  },
}
