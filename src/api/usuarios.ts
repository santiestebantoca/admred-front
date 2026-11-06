import { api } from './client'
import type {
  Id,
  InsertResult,
  UpdateResult,
  UsuariosListaResponse,
  UsuariosParams,
} from '@/types/api'
import type { UsuarioCreate, UsuarioDetalle, UsuarioUpdate } from '@/types/models'

export const usuariosApi = {
  getAll: (params: UsuariosParams = {}) =>
    api.get<UsuariosListaResponse>('/usuarios/usuarios', { params }).then(res => res.data),
  create: (data: UsuarioCreate) =>
    api.post<InsertResult>('/usuarios/usuarios', data).then(res => res.data),
  delete: (id: Id) =>
    api.delete<number>(`/usuarios/usuarios/${id}`).then(res => res.data),
  getById: (id: Id) =>
    api.get<UsuarioDetalle>(`/usuarios/usuarios/${id}`).then(res => res.data),
  update: (id: Id, data: Omit<UsuarioUpdate, 'id'>) =>
    api.put<UpdateResult>(`/usuarios/usuarios/${id}`, data).then(res => res.data),
}
