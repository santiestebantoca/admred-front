import { useToast } from 'bootstrap-vue-next'
import { isApiError, isValidationError } from '@/api/client'

type VarianteToast = 'success' | 'danger' | 'warning' | 'info'

interface OpcionesToast {
  position?: string
  modelValue?: number
}

const POSICION = 'bottom-center'

export const DURACION_POR_VARIANTE: Record<VarianteToast, number> = {
  success: 3000,
  info: 4000,
  warning: 5000,
  danger: 7000
}

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

  const notificar = (body: string, variant: VarianteToast, opciones: OpcionesToast = {}) => {
    const modelValue = opciones.modelValue ?? DURACION_POR_VARIANTE[variant]

    const controller = create({
      body,
      variant,
      position: opciones.position ?? POSICION,
      modelValue
    })

    // BVN deja el toast montado después de ocultarse. Al resolverse el ciclo
    // show/hide, destruimos el controller para liberar el store y el DOM.
    if (modelValue > 0) {
      controller.show().then(() => controller.destroy()).catch(() => {})
    }

    return controller
  }

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
