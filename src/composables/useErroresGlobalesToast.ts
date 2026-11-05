import { events } from '@/api/client'
import { DURACION_POR_VARIANTE, useNotificaciones } from '@/composables/useNotificaciones'
import { onUnmounted, watch } from 'vue'

type ErrorType = 'network' | 'server' | 'client' | 'unknown' | (string & {})

interface ErrorGlobal {
  message: string
  type: ErrorType
}

const VARIANTE_POR_TIPO: Record<string, 'danger' | 'warning' | 'info'> = {
  network: 'danger',
  server: 'warning'
}

// Compartido a nivel de módulo: si el composable se instancia más de una vez,
// la deduplicación sigue siendo global.
const ultimaVezPorError = new Map<string, number>()

const claveDeError = ({ message, type }: ErrorGlobal) => `${type}:${message}`

export function useErroresGlobalesToast() {
  const { notificar, listo } = useNotificaciones()
  const pendientes: ErrorGlobal[] = []

  const mostrar = (error: ErrorGlobal) => {
    const clave = claveDeError(error)
    const variante = VARIANTE_POR_TIPO[error.type] ?? 'info'
    const ventana = DURACION_POR_VARIANTE[variante]
    const ahora = Date.now()
    const ultimaVez = ultimaVezPorError.get(clave) ?? 0

    // Mientras el toast de esa severidad siga visible, no repetimos el mismo error.
    if (ahora - ultimaVez < ventana) return

    ultimaVezPorError.set(clave, ahora)
    notificar(error.message, variante)
  }

  const handleError = (error: ErrorGlobal) => {
    // Si BApp todavía no ha montado su orchestrator, guardamos el error
    // y lo mostramos en cuanto esté disponible.
    if (listo.value) {
      mostrar(error)
      return
    }

    const yaPendiente = pendientes.some(p => claveDeError(p) === claveDeError(error))
    if (!yaPendiente) pendientes.push(error)
  }

  watch(
    listo,
    (instalado) => {
      if (!instalado) return
      pendientes.splice(0).forEach(mostrar)
    },
    { flush: 'post' }
  )

  // Se registra en setup (no en onMounted) para no perder errores
  // emitidos desde el onMounted de las vistas hijas.
  events.on('error', handleError)
  onUnmounted(() => events.off('error', handleError))
}
