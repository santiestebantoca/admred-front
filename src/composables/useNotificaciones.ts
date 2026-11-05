import { useToast } from 'bootstrap-vue-next'
import { isApiError, isValidationError } from '@/api/client'

type VarianteToast = 'success' | 'danger' | 'warning' | 'info'

interface OpcionesToast {
  position?: string
  modelValue?: number
}

const POSICION = 'bottom-center'
const DURACION = 5000

function primerMensajeDeError(errors: unknown): string | null {
  if (typeof errors === 'string') return errors

  if (Array.isArray(errors)) {
    for (const item of errors) {
      const mensaje = primerMensajeDeError(item)
      if (mensaje) return mensaje
    }
    return null
  }

  if (errors && typeof errors === 'object') {
    for (const valor of Object.values(errors)) {
      const mensaje = primerMensajeDeError(valor)
      if (mensaje) return mensaje
    }
  }

  return null
}

export function useNotificaciones() {
  const { create, _isOrchestratorInstalled } = useToast()

  const notificar = (body: string, variant: VarianteToast, opciones: OpcionesToast = {}) =>
    create({
      body,
      variant,
      position: opciones.position ?? POSICION,
      modelValue: opciones.modelValue ?? DURACION
    })

  const exito = (body: string, opciones?: OpcionesToast) => notificar(body, 'success', opciones)
  const error = (body: string, opciones?: OpcionesToast) => notificar(body, 'danger', opciones)
  const aviso = (body: string, opciones?: OpcionesToast) => notificar(body, 'warning', opciones)
  const info = (body: string, opciones?: OpcionesToast) => notificar(body, 'info', opciones)

  /**
   * Muestra solo los errores que el interceptor global NO notifica (validación).
   * Red/servidor/401/403/404/etc. ya los muestra `useErroresGlobalesToast`.
   */
  const errorDeApi = (err: unknown, mensajePorDefecto: string) => {
    if (isValidationError(err)) {
      const mensaje = primerMensajeDeError(err.errors) ?? mensajePorDefecto
      return error(mensaje)
    }

    if (!isApiError(err)) return error(mensajePorDefecto)
  }

  return {
    notificar,
    exito,
    error,
    aviso,
    info,
    errorDeApi,
    listo: _isOrchestratorInstalled
  }
}
