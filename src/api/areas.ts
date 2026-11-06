import { api } from './client'
import type { AreaCreate, AreaDetalle, AreaUpdate } from '@/types/models'
import type {
  AreasListaResponse,
  AreasParams,
  Id,
  InsertResult,
  UpdateResult,
} from '@/types/api'

export const areasApi = {
  getAll: (params: AreasParams = {}) =>
    api.get<AreasListaResponse>('/areas/areas', { params }).then(res => res.data),
  create: (data: AreaCreate) =>
    api.post<InsertResult>('/areas/areas', data).then(res => res.data),
  delete: (id: Id) =>
    api.delete<number>(`/areas/areas/${id}`).then(res => res.data),
  getById: (id: Id) =>
    api.get<AreaDetalle>(`/areas/areas/${id}`).then(res => res.data),
  update: (id: Id, data: Omit<AreaUpdate, 'id'>) =>
    api.put<UpdateResult>(`/areas/areas/${id}`, data).then(res => res.data),
}
