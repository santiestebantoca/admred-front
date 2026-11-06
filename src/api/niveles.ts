import { api } from './client'
import type { NivelesResponse } from '@/types/api'

export const nivelesApi = {
  getAll: () =>
    api.get<NivelesResponse>('/niveles/niveles').then(res => res.data),
}
