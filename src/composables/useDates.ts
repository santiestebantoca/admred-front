import { useDateFormat } from "@vueuse/core"
import { ref, watch, onScopeDispose, type Ref } from "vue"

/**
 * Tipo aceptado por las funciones de fecha: Date, string o timestamp numérico,
 * así como valores nulos/indefinidos que se tratan como fecha inválida.
 */
type DateInput = Date | string | number | null | undefined

/**
 * Convierte un valor a objeto Date de forma segura.
 * @param val - Fecha en formato Date, string, número, o null/undefined.
 * @returns Instancia de Date o null si no es convertible.
 */
const getDate = (val: DateInput): Date | null => {
  if (val instanceof Date) return val
  if (typeof val === "string" || typeof val === "number") {
    const d = new Date(val)
    return isNaN(d.getTime()) ? null : d
  }
  return null
}

/**
 * Calcula los días de calendario transcurridos desde una fecha dada hasta hoy.
 * @param val - Fecha en formato Date, string, o null/undefined.
 * @returns Número de días calendario o undefined si la fecha es inválida.
 */
const daysAgo = (val: DateInput): number | undefined => {
  const date = getDate(val)
  if (!date) return undefined

  // 1. Obtenemos el inicio del día actual (Hoy a las 00:00:00.000)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // 2. Obtenemos el inicio del día de la fecha objetivo
  // NOTA: Instanciamos un nuevo Date para no mutar el objeto original por referencia.
  const targetDate = new Date(date.getTime())
  targetDate.setHours(0, 0, 0, 0)

  // 3. Calculamos la diferencia
  const timeDelta = today.getTime() - targetDate.getTime()

  // Ahora la división siempre dará un número entero exacto (0, 1, 2, etc.)
  // Usamos Math.round por seguridad frente a posibles cambios de horario de verano (DST)
  return Math.round(timeDelta / (1000 * 3600 * 24))
}

// Estado global compartido
const now = ref(new Date())
const day = ref(now.value.getDate())
const hour = ref(now.value.getHours())

let intervalTimer: ReturnType<typeof setInterval> | null = null
let refCount = 0

/** Inicia el intervalo si no está ya corriendo. */
function startInterval(): void {
  if (intervalTimer) return
  intervalTimer = setInterval(() => {
    now.value = new Date()
    day.value = now.value.getDate()
    hour.value = now.value.getHours()
  }, 1000)
}

/** Detiene el intervalo si existe. */
function stopInterval(): void {
  if (intervalTimer) {
    clearInterval(intervalTimer)
    intervalTimer = null
  }
}

/**
 * Composable que provee la fecha y hora actuales (actualiza cada segundo).
 * Es un singleton: todos los consumidores comparten el mismo estado y el
 * intervalo se inicia/detiene automáticamente según el número de usuarios activos.
 * @returns Objeto con las refs reactivas `day` y `hour`.
 */
export function useDateTime(): { day: Ref<number>; hour: Ref<number> } {
  // Si es el primer consumidor, arrancamos el intervalo
  if (refCount === 0) {
    startInterval()
  }
  refCount++

  // Al desmontar el componente, decrementamos el contador y paramos si es el último
  onScopeDispose(() => {
    refCount--
    if (refCount === 0) {
      stopInterval()
    }
  })

  // Devolvemos las mismas refs compartidas para todos
  return { day, hour }
}

/**
 * Devuelve una referencia reactiva con un texto formateado que representa
 * la fecha relativa al día actual. Ejemplos:
 *   - Si es hoy: "Hoy 14:30"
 *   - Si fue ayer: "Ayer 10:15"
 *   - Otros días: "12 Mar 08:00"
 *
 * La referencia se actualiza automáticamente cuando cambia el día (a medianoche)
 * gracias al watcher sobre `day` de `useDateTime`.
 *
 * @param strDate - Fecha a formatear (Date, string, o null/undefined).
 * @returns Ref<string | null> - Texto formateado o null si la fecha es inválida.
 */
export function shortTime(strDate: DateInput): Ref<string | null> {
  const res = ref<string | null>(null)
  const date = getDate(strDate)

  if (!date) {
    return res // devolvemos null directamente
  }

  // Obtenemos la ref compartida del día actual
  const { day } = useDateTime()

  // Función que actualiza el valor de res según la fecha dada
  const updateValue = (): void => {
    const ago = daysAgo(date)
    if (ago === 0) {
      res.value = `Hoy ${useDateFormat(date, "HH:mm").value}`
    } else if (ago === 1) {
      res.value = `Ayer ${useDateFormat(date, "HH:mm").value}`
    } else {
      res.value = useDateFormat(date, "D MMM HH:mm").value
    }
  }

  // Creamos el watcher y guardamos su función de parada
  const stopWatch = watch(day, updateValue, { immediate: true })

  // Al desmontar el componente, detenemos este watcher y limpiamos la ref
  onScopeDispose(() => {
    stopWatch()
    res.value = null
  })

  return res
}

/**
 * Devuelve una referencia reactiva con un texto formateado compacto que
 * representa la fecha relativa al día actual. Ejemplos:
 *   - Si es hoy: "14:30"
 *   - Si fue ayer: "Ayer"
 *   - Otros días: "12/03/2025"
 *
 * La referencia se actualiza automáticamente cuando cambia el día (a medianoche)
 * gracias al watcher sobre `day` de `useDateTime`.
 *
 * @param strDate - Fecha a formatear (Date, string, o null/undefined).
 * @returns Ref<string | null> - Texto formateado o null si la fecha es inválida.
 */
export function shorterTime(strDate: DateInput): Ref<string | null> {
  const res = ref<string | null>(null)
  const date = getDate(strDate)

  if (!date) {
    return res // devolvemos null directamente
  }

  // Obtenemos la ref compartida del día actual
  const { day } = useDateTime()

  // Función que actualiza el valor de res según la fecha dada
  const updateValue = (): void => {
    const ago = daysAgo(date)
    if (ago === 0) {
      res.value = useDateFormat(date, "HH:mm").value
    } else if (ago === 1) {
      res.value = "Ayer"
    } else {
      res.value = useDateFormat(date, "DD/MM/YYYY").value
    }
  }

  // Creamos el watcher y guardamos su función de parada
  const stopWatch = watch(day, updateValue, { immediate: true })

  // Al desmontar el componente, detenemos este watcher y limpiamos la ref
  onScopeDispose(() => {
    stopWatch()
    res.value = null
  })

  return res
}

/**
 * Devuelve una referencia reactiva con un texto formateado de tipo lista que
 * representa la fecha relativa al día actual. Ejemplos:
 *   - Si es hoy: "14:30"
 *   - Otros días: "12/03/2025 14:30"
 *
 * La referencia se actualiza automáticamente cuando cambia el día (a medianoche)
 * gracias al watcher sobre `day` de `useDateTime`.
 *
 * @param strDate - Fecha a formatear (Date, string, o null/undefined).
 * @returns Ref<string | null> - Texto formateado o null si la fecha es inválida.
 */
export function listTime(strDate: DateInput): Ref<string | null> {
  const res = ref<string | null>(null)
  const date = getDate(strDate)

  if (!date) {
    return res // devolvemos null directamente
  }

  // Obtenemos la ref compartida del día actual
  const { day } = useDateTime()

  // Función que actualiza el valor de res según la fecha dada
  const updateValue = (): void => {
    if (daysAgo(date) === 0) {
      res.value = useDateFormat(date, "HH:mm").value
    } else {
      res.value = useDateFormat(date, "DD/MM/YYYY HH:mm").value
    }
  }

  // Creamos el watcher y guardamos su función de parada
  const stopWatch = watch(day, updateValue, { immediate: true })

  // Al desmontar el componente, detenemos este watcher y limpiamos la ref
  onScopeDispose(() => {
    stopWatch()
    res.value = null
  })

  return res
}

/**
 * Devuelve el texto de una fecha con formato día/mes/año y hora.
 * @param strDate - Fecha a formatear (Date, string, o null/undefined).
 * @returns Texto "DD/MM/YYYY HH:mm" o null si la fecha es inválida.
 */
export function formatTime(strDate: DateInput): string | null {
  const date = getDate(strDate)
  return date ? useDateFormat(date, "DD/MM/YYYY HH:mm").value : null
}

/**
 * Devuelve el texto de una fecha con formato día/mes/año.
 * @param strDate - Fecha a formatear (Date, string, o null/undefined).
 * @returns Texto "DD/MM/YYYY" o null si la fecha es inválida.
 */
export function formatDate(strDate: DateInput): string | null {
  const date = getDate(strDate)
  return date ? useDateFormat(date, "DD/MM/YYYY").value : null
}

/**
 * Devuelve el texto de una fecha con formato de hora y minutos.
 * @param strDate - Fecha a formatear (Date, string, o null/undefined).
 * @returns Texto "HH:mm" o null si la fecha es inválida.
 */
export function formatHM(strDate: DateInput): string | null {
  const date = getDate(strDate)
  return date ? useDateFormat(date, "HH:mm").value : null
}