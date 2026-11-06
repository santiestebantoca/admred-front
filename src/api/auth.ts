import { api } from './client'
import type { AuthUsersParams, AuthUser, Id, UsuarioOpcion } from '@/types/api'
import type { LoginCredentials } from '@/types/models'

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthUser>('/auth/login', credentials).then(res => res.data),
  logout: () =>
    api.delete<AuthUser | null>('/auth/login').then(res => res.data),
  getCurrentUser: () =>
    api.get<AuthUser | null>('/auth/login').then(res => res.data),
  impersonate: (userId: Id) =>
    api.post<AuthUser | null>(`/auth/impersonate/${userId}`).then(res => res.data),
  getImpersonateables: (params: AuthUsersParams = {}) =>
    api.get<UsuarioOpcion[]>('/auth/users', { params }).then(res => res.data),
}
