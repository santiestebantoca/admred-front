import { api } from './client'

export const authGroupsApi = {
  getAll: () => api.get('/auth_groups/auth_groups').then(res => res.data),
}