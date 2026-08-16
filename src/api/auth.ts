import { api } from './client'

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials).then(res => res.data),
  logout: () => api.delete('/auth/login').then(res => res.data),
  getCurrentUser: () => api.get('/auth/login').then(res => res.data),
  impersonate: (userId) => api.post(`/auth/impersonate/${userId}`).then(res => res.data),
  getImpersonateables: (params) => api.get('/auth/users', { params }).then(res => res.data)
}