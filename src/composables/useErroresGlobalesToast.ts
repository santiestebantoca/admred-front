import { useToast } from 'bootstrap-vue-next'
import { events } from '@/api/client'
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
  const { create, _isOrchestratorInstalled } = useToast()
  const pendientes: ErrorGlobal[] = []

  const mostrar = ({ message, type }: ErrorGlobal) => {
    create({
      body: message,
      position: 'bottom-center',
      modelValue: 5000,
      variant: VARIANTE_POR_TIPO[type] ?? 'info'
    })
  }

  const handleError = (error: ErrorGlobal) => {
    // Si BApp todavía no ha montado su orchestrator, guardamos el error
    // y lo mostramos en cuanto esté disponible.
    if (_isOrchestratorInstalled.value) mostrar(error)
    else pendientes.push(error)
  }

  watch(
    _isOrchestratorInstalled,
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
