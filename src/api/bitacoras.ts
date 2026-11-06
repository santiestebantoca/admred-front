import { api } from './client'
import type { SolicitudIdParams } from '@/types/api'
import type { BitacoraDetalle } from '@/types/models'

export const bitacorasApi = {
  getAll: (params: SolicitudIdParams) =>
    api.get<BitacoraDetalle[]>('/bitacoras/bitacoras', { params }).then(res => res.data),
}
