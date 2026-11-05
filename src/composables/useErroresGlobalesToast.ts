import { events } from '@/api/client'
import { useNotificaciones } from '@/composables/useNotificaciones'
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

export function useErroresGlobalesToast() {
  const { notificar, listo } = useNotificaciones()
  const pendientes: ErrorGlobal[] = []

  const mostrar = ({ message, type }: ErrorGlobal) => {
    notificar(message, VARIANTE_POR_TIPO[type] ?? 'info')
  }

  const handleError = (error: ErrorGlobal) => {
    // Si BApp todavía no ha montado su orchestrator, guardamos el error
    // y lo mostramos en cuanto esté disponible.
    if (listo.value) mostrar(error)
    else pendientes.push(error)
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
