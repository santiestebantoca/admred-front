import { computed, nextTick, ref, watch } from 'vue'
import type { Ref } from 'vue'

export const TEXTO_MAX_DEFAULT = 250

/**
 * Limita un texto editable por el usuario y avisa cuando se intenta exceder.
 *
 * - `modelo`: ref escribible con el texto a limitar.
 * - `max`: límite normal (160 por defecto).
 *
 * Un valor heredado que ya supere `max` no se recorta: se registra con
 * `registrarHeredado` y su longitud pasa a ser el tope efectivo, de modo que
 * solo se impide ampliarlo. Si el texto baja a `max` o menos, vuelve a regir
 * el límite normal.
 */
export function useTextLimit(
  modelo: Ref<string | null | undefined>,
  max = TEXTO_MAX_DEFAULT
) {
  const avisoRecorte = ref<string | null>(null)
  const topeHeredado = ref(0)

  const largo = computed(() => modelo.value?.length ?? 0)
  const tope = computed(() => Math.max(max, topeHeredado.value))
  const avisoHeredado = computed(() =>
    avisoRecorte.value === null && tope.value > max && largo.value > max
      ? `El texto heredado supera los ${max} caracteres; no se recortará automáticamente, pero no puede ampliarse.`
      : null
  )
  const aviso = computed(() => avisoRecorte.value ?? avisoHeredado.value)

  // Al reducir un texto heredado a los límites normales, deja de aplicarse la
  // excepción y vuelve a regir `max` para el resto de la edición.
  watch(largo, n => {
    if (n <= max) topeHeredado.value = 0
  })

  const registrarHeredado = (valor: string | null | undefined) => {
    const n = valor?.length ?? 0
    if (n > max) topeHeredado.value = Math.max(topeHeredado.value, n)
  }

  const mensajeRecorte = (pegado: boolean) => {
    if (tope.value > max) {
      return pegado
        ? 'El texto pegado no puede ampliar el texto heredado; se recortó el texto.'
        : 'El texto heredado no puede superar su longitud original; se recortó el texto.'
    }
    return pegado
      ? `El texto pegado supera el máximo de ${max} caracteres; se recortó el texto.`
      : `El texto admite un máximo de ${max} caracteres; se recortó el texto.`
  }

  const restaurarCursor = (evt: Event, posicion: number) => {
    const target = evt.target
    if (!(target instanceof HTMLTextAreaElement)) return
    nextTick(() => {
      if (!target.isConnected) return
      const pos = Math.min(posicion, target.value.length)
      target.setSelectionRange(pos, pos)
    })
  }

  const formatear = (valor: string | null, evt: Event) => {
    const texto = valor ?? ''
    const inputEvent = evt as InputEvent

    // No truncar a mitad de la composición de un carácter (acentos, IME).
    if (inputEvent.isComposing) return texto

    if (texto.length <= tope.value) {
      if (evt.type === 'input') avisoRecorte.value = null
      return texto
    }

    const pegado =
      inputEvent.inputType === 'insertFromPaste' ||
      inputEvent.inputType === 'insertFromDrop'
    avisoRecorte.value = mensajeRecorte(pegado)

    if (evt.type === 'input') {
      const target = evt.target
      if (target instanceof HTMLTextAreaElement) {
        restaurarCursor(evt, target.selectionStart ?? tope.value)
      }
    }

    return texto.slice(0, tope.value)
  }

  const alTerminarComposicion = (evt: CompositionEvent) => {
    const target = evt.target
    if (!(target instanceof HTMLTextAreaElement)) return
    const texto = target.value ?? ''
    if (texto.length <= tope.value) return
    avisoRecorte.value = mensajeRecorte(false)
    modelo.value = texto.slice(0, tope.value)
    restaurarCursor(evt, tope.value)
  }

  const validar = (valor: string | null | undefined) =>
    (valor?.length ?? 0) <= tope.value

  return {
    max,
    largo,
    tope,
    aviso,
    avisoRecorte,
    avisoHeredado,
    registrarHeredado,
    formatear,
    alTerminarComposicion,
    validar
  }
}
