import { api } from './client'
import type { NotificacionesResponse } from '@/types/api'

export const notificacionesApi = {
  getAll: () =>
    api.get<NotificacionesResponse>('/notificaciones/notificaciones').then(res => res.data),
}
