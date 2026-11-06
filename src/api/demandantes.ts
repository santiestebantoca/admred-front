import { api } from './client'
import type { DemandanteRow, DemandantesParams } from '@/types/api'

export const demandantesApi = {
  getAll: (params: DemandantesParams) =>
    api.get<DemandanteRow[]>('/demandantes/demandantes', { params }).then(res => res.data),
}
