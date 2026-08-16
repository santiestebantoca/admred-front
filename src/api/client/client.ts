import axios from 'axios'
import {
  NetworkError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
  ServerError,
  ApiError
} from './errors'
import mitt from 'mitt'
import { shallowRef } from 'vue'

// Importar los mensajes externalizados
import { ERROR_MESSAGES } from '@/constants/errorMessages'

export const events = mitt()

const notify = (type, message) => events.emit('error', { message, type })

export const initAxiosInterceptors = () => {
  // No inyectamos el router aquí: solo registramos el interceptor.
}

export const api = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 120000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  paramsSerializer: {
    indexes: null
  }
})

export const lastServerAccess = shallowRef(new Date())
const touchLastServerAccess = () => lastServerAccess.value = new Date()

api.interceptors.response.use(
  response => {
    touchLastServerAccess()
    return response
  },
  error => {
    if (axios.isCancel(error)) throw error
    if (error instanceof ApiError) throw error

    if (!error.response) {
      notify('network', ERROR_MESSAGES.network)
      throw new NetworkError('Sin conexión o servidor inaccesible.', error)
    }

    const { status, data, headers, config } = error.response
    const isHtml = headers['content-type']?.includes('text/html') ||
      (typeof data === 'string' && data.trim().startsWith('<'))

    let message = config?.url ? `Error en ${config.url}` : 'Error del servidor'
    if (!isHtml && data?.message) message = data.message
    else if (isHtml) message = ERROR_MESSAGES.htmlResponse

    switch (status) {
      case 401:
        notify('client', ERROR_MESSAGES.unauthorized)
        events.emit('unauthorized', { next: config?.url })
        throw new AuthenticationError(message, error)

      case 403:
        notify('client', ERROR_MESSAGES.forbidden)
        throw new AuthorizationError(message, error)

      case 404:
        notify('client', ERROR_MESSAGES.notFound)
        throw new NotFoundError(message, error)

      case 422:
        throw new ValidationError(message, data, error)

      case 500:
      case 502:
      case 503:
      case 504:
        notify('server', ERROR_MESSAGES.server)
        throw new ServerError(ERROR_MESSAGES.internalServer, error)

      default:
        if (error.code === 'ECONNABORTED') {
          notify('network', ERROR_MESSAGES.timeout)
        } else if (error.message === 'Network Error') {
          notify('network', ERROR_MESSAGES.connection)
        } else {
          notify('unknown', ERROR_MESSAGES.unknown)
        }
        throw new ApiError(message, status, data, error)
    }
  }
)