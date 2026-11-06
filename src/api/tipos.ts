import { api } from './client'
import type {
  Id,
  InsertResult,
  TiposListaResponse,
  TiposParams,
  UpdateResult,
} from '@/types/api'
import type { TipoCreate, TipoDetalle, TipoUpdate } from '@/types/models'

export const tiposApi = {
  getAll: (params: TiposParams = {}) =>
    api.get<TiposListaResponse>('/tipos/tipos', { params }).then(res => res.data),
  create: (data: TipoCreate) =>
    api.post<InsertResult>('/tipos/tipos', data).then(res => res.data),
  delete: (id: Id) =>
    api.delete<number>(`/tipos/tipos/${id}`).then(res => res.data),
  getById: (id: Id) =>
    api.get<TipoDetalle>(`/tipos/tipos/${id}`).then(res => res.data),
  update: (id: Id, data: Omit<TipoUpdate, 'id'>) =>
    api.put<UpdateResult>(`/tipos/tipos/${id}`, data).then(res => res.data),
}
