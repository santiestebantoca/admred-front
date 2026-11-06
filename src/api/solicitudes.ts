import { api } from './client'
import type {
  Id,
  InsertResult,
  SolicitudesListaResponse,
  SolicitudesParams,
  UpdateResult,
} from '@/types/api'
import type {
  SolicitudCreate,
  SolicitudCreateFromParent,
  SolicitudDetalle,
  SolicitudUpdatePayload,
} from '@/types/models'

export const solicitudesApi = {
  getAll: (params: SolicitudesParams) =>
    api.get<SolicitudesListaResponse>('/solicitudes/solicitudes', { params }).then(res => res.data),
  create: (data: SolicitudCreate | SolicitudCreateFromParent) =>
    api.post<InsertResult>('/solicitudes/solicitudes', data).then(res => res.data),
  getById: (id: Id) =>
    api.get<SolicitudDetalle>(`/solicitudes/solicitudes/${id}`).then(res => res.data),
  /**
   * El controlador responde con el número de filas actualizadas al asignar y
   * con `{ updated, errors }` en las demás acciones.
   */
  update: (id: Id, data: SolicitudUpdatePayload) =>
    api.put<number | UpdateResult>(`/solicitudes/solicitudes/${id}`, data).then(res => res.data),
}
