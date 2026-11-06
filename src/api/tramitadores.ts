import { api } from './client'
import type { TramitadorOpcion, TramitadoresParams } from '@/types/api'

export const tramitadoresApi = {
  getAll: (params: TramitadoresParams = {}) =>
    api.get<TramitadorOpcion[]>('/tramitadores/tramitadores', { params }).then(res => res.data),
}
