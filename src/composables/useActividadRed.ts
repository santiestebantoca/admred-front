import { computed, readonly, ref } from 'vue'

/**
 * Contador global de peticiones HTTP en curso.
 *
 * Vive a nivel de módulo para que cualquier componente pueda consultarlo sin
 * depender de un store. Lo alimentan los interceptores de `@/api/client` y lo
 * consumen indicadores globales como `BarraProgreso`.
 */
const peticionesEnCurso = ref(0)

/** Registra el inicio de una petición HTTP. */
export function iniciarPeticion() {
  peticionesEnCurso.value += 1
}

/**
 * Registra el fin de una petición HTTP.
 * Se protege contra decrementos extra para no dejar el contador en negativo.
 */
export function finalizarPeticion() {
  peticionesEnCurso.value = Math.max(0, peticionesEnCurso.value - 1)
}

const peticionesActivas = readonly(peticionesEnCurso)
const hayPeticiones = computed(() => peticionesEnCurso.value > 0)

export function useActividadRed() {
  return {
    peticionesActivas,
    hayPeticiones
  }
}
