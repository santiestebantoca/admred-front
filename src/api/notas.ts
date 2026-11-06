import { api } from './client'
import type { SolicitudIdParams } from '@/types/api'
import type { Nota, NotaCreate } from '@/types/models'

export const notasApi = {
  create: (data: NotaCreate) =>
    api.post<number>('/notas/notas', data).then(res => res.data),
  getAll: (params: SolicitudIdParams) =>
    api.get<Nota[]>('/notas/notas', { params }).then(res => res.data),
}
