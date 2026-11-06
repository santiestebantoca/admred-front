import { api } from './client'
import type { ConsultadaRow, ConsultadasParams } from '@/types/api'

export const consultadasApi = {
  getAll: (params: ConsultadasParams) =>
    api.get<ConsultadaRow[]>('/consultadas/consultadas', { params }).then(res => res.data),
}
