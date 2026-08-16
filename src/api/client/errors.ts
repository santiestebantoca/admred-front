export class ApiError extends Error {
  statusCode: number | null
  data: unknown
  originalError: unknown

  constructor(message: string, statusCode: number | null, data: unknown = null, originalError: unknown = null) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.data = data
    this.originalError = originalError
  }
}

export class NetworkError extends ApiError {
  constructor(message, originalError) {
    super(message, null, null, originalError)
    this.name = 'NetworkError'
  }
}

export class AuthenticationError extends ApiError {
  constructor(message, originalError) {
    super(message, 401, null, originalError)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends ApiError {
  constructor(message, originalError) {
    super(message, 403, null, originalError)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends ApiError {
  constructor(message, originalError) {
    super(message, 404, null, originalError)
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends ApiError {
  errors: unknown

  constructor(message: string, data: unknown, originalError: unknown) {
    super(message, 422, data, originalError)
    this.name = 'ValidationError'
    // Normaliza estructuras comunes: { errors: { field: ["msg"] } } o { field: ["msg"] }
    this.errors = (data as any)?.errors || data
  }
}

export class ServerError extends ApiError {
  constructor(message: string, originalError: unknown) {
    super(message, 500, null, originalError)
    this.name = 'ServerError'
  }
}

// Type guards para uso seguro en TypeScript/JS
export const isApiError = (err: unknown): err is ApiError => err instanceof ApiError
export const isNetworkError = (err: unknown): err is NetworkError => err instanceof NetworkError
export const isValidationError = (err: unknown): err is ValidationError => err instanceof ValidationError