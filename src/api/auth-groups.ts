import { api } from './client'
import type { AuthGroupsResponse } from '@/types/api'

export const authGroupsApi = {
  getAll: () =>
    api.get<AuthGroupsResponse>('/auth_groups/auth_groups').then(res => res.data),
}
