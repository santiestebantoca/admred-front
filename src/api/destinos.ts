import { api } from './client'
import type { DestinoOpcion, DestinosParams } from '@/types/api'

export const destinosApi = {
  getAll: (params: DestinosParams = {}) =>
    api.get<DestinoOpcion[]>('/destinos/destinos', { params }).then(res => res.data),
}
