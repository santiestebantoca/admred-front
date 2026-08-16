import { ref, onScopeDispose, type Ref } from "vue"

/**
 * Composable que detecta si un elemento del DOM (selector) está presente.
 * Realiza polling con backoff progresivo (100ms → 200ms → 400ms → ...) hasta
 * un máximo de 5 segundos entre intentos, o hasta que se encuentre el elemento.
 *
 * @param selector - Selector CSS del elemento a buscar.
 * @param maxAttempts - Número máximo de intentos (por defecto 50, suficiente para la mayoría de casos).
 * @returns Ref<boolean> - `true` cuando el elemento existe, `false` mientras no se encuentra.
 */
export function useTeleportTarget(
  selector: string,
  maxAttempts: number = 50
): Ref<boolean> {
  const found = ref(false)

  let attempts = 0
  let delay = 100 // empieza en 100ms
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let isActive = true // flag para evitar ejecuciones después del desmontaje

  const check = () => {
    // Si el componente ya se desmontó o superamos intentos, salimos
    if (!isActive || attempts >= maxAttempts) {
      return
    }

    attempts++

    if (document.querySelector(selector)) {
      found.value = true
      return // detenemos el polling
    }

    // Backoff: duplicamos el delay hasta un máximo de 5000ms (5s)
    delay = Math.min(delay * 2, 5000)

    // Programamos la siguiente comprobación
    timeoutId = setTimeout(check, delay)
  }

  // Iniciamos el primer chequeo (inmediato)
  check()

  // Limpieza al desmontar el componente
  onScopeDispose(() => {
    isActive = false
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  })

  return found
}