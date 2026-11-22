import { useDateFormat } from "@vueuse/core"
import { ref, type Ref } from "vue"

/**
 * Tipo aceptado por las funciones de fecha: Date, string o timestamp numérico,
 * así como valores nulos/indefinidos que se tratan como fecha inválida.
 */
type DateInput = Date | string | number | null | undefined

/** Devuelve la fecha solo si es válida; de lo contrario, null. */
const toValidDate = (date: Date): Date | null =>
  isNaN(date.getTime()) ? null : date

/**
 * Construye una fecha local y descarta desbordamientos (mes 13, día 40, etc.).
 * @returns La fecha si todos sus componentes coinciden, o null.
 */
const fromParts = (
  y: number,
  m: number,
  d: number,
  hh = 0,
  mi = 0,
  ss = 0
): Date | null => {
  const date = new Date(y, m - 1, d, hh, mi, ss)
  const valida = date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d &&
    date.getHours() === hh &&
    date.getMinutes() === mi &&
    date.getSeconds() === ss
  return valida ? date : null
}

/**
 * Convierte un valor a objeto Date de forma segura.
 * @param val - Fecha en formato Date, string, número, o null/undefined.
 * @returns Instancia de Date válida o null si no es convertible.
 */
const getDate = (val: DateInput): Date | null => {
  if (val instanceof Date) return toValidDate(val)
  if (typeof val === "string") {
    // Caso servidor: "YYYY-MM-DD HH:mm:ss"
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(val)) {
      const [datePart, timePart] = val.split(" ")
      const [y, m, d] = datePart.split("-").map(Number)
      const [hh, mm, ss] = timePart.split(":").map(Number)
      return fromParts(y, m, d, hh, mm, ss)
    }

    // Caso ISO con T y zona
    if (/T\d{2}:\d{2}/.test(val)) {
      return toValidDate(new Date(val))
    }

    // Caso simple del datepicker: "YYYY-MM-DD"
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
      const [y, m, d] = val.split("-").map(Number)
      return fromParts(y, m, d)
    }

    // Cualquier otro texto (vacío, basura, formatos no soportados)
    return null
  }
  if (typeof val === "number") {
    return toValidDate(new Date(val))
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

// Estado del reloj compartido. `day` es la dependencia reactiva que leen los
// formateadores relativos: al cambiar el día, el efecto que los invoca (el
// render de la tabla o de la vista móvil) se vuelve a ejecutar.
const day = ref(new Date().getDate())
const hour = ref(new Date().getHours())

let intervalTimer: ReturnType<typeof setInterval> | null = null

/**
 * Inicia el reloj compartido una sola vez.
 *
 * Los formateadores relativos se invocan durante el render, donde no existe un
 * `EffectScope` al que asociar limpiezas. Por eso no se usan `onScopeDispose` ni
 * watchers propios: quedarían sin limpiar y se acumularían en cada render. La
 * reactividad la aporta la lectura de `day` dentro del efecto que renderiza.
 */
function ensureClock(): void {
  if (intervalTimer) return

  intervalTimer = setInterval(() => {
    const actual = new Date()
    day.value = actual.getDate()
    hour.value = actual.getHours()
  }, 1000)
}

/**
 * Devuelve las refs compartidas de día y hora del reloj de la aplicación.
 * El intervalo se inicia la primera vez que se usa cualquier función de fecha.
 * @returns Objeto con las refs reactivas `day` y `hour`.
 */
export function useDateTime(): { day: Ref<number>; hour: Ref<number> } {
  ensureClock()
  return { day, hour }
}

/**
 * Devuelve el texto formateado de una fecha relativa al día actual. Ejemplos:
 *   - Si es hoy: "Hoy 14:30"
 *   - Si fue ayer: "Ayer 10:15"
 *   - Otros días: "12 Mar 08:00"
 *
 * Al leer `day`, el efecto que invoca la función (normalmente el render del
 * componente) se recalcula cuando cambia el día.
 *
 * @param strDate - Fecha a formatear (Date, string, o null/undefined).
 * @returns Texto formateado o null si la fecha es inválida.
 */
export function shortTime(strDate: DateInput): string | null {
  const date = getDate(strDate)
  if (!date) return null

  ensureClock()
  day.value // Dependencia del render: refresca el texto al cambiar el día.

  const hora = useDateFormat(date, "HH:mm").value
  const ago = daysAgo(date)
  if (ago === 0) return `Hoy ${hora}`
  if (ago === 1) return `Ayer ${hora}`
  return useDateFormat(date, "D MMM HH:mm").value
}

/**
 * Devuelve el texto formateado compacto de una fecha relativa al día actual.
 * Ejemplos:
 *   - Si es hoy: "14:30"
 *   - Si fue ayer: "Ayer"
 *   - Otros días: "12/03/2025"
 *
 * Al leer `day`, el efecto que invoca la función (normalmente el render del
 * componente) se recalcula cuando cambia el día.
 *
 * @param strDate - Fecha a formatear (Date, string, o null/undefined).
 * @returns Texto formateado o null si la fecha es inválida.
 */
export function shorterTime(strDate: DateInput): string | null {
  const date = getDate(strDate)
  if (!date) return null

  ensureClock()
  day.value // Dependencia del render: refresca el texto al cambiar el día.

  const hora = useDateFormat(date, "HH:mm").value
  const ago = daysAgo(date)
  if (ago === 0) return hora
  if (ago === 1) return "Ayer"
  return useDateFormat(date, "DD/MM/YYYY").value
}

/**
 * Devuelve el texto formateado de tipo lista de una fecha relativa al día
 * actual. Ejemplos:
 *   - Si es hoy: "14:30"
 *   - Otros días: "12/03/2025 14:30"
 *
 * Al leer `day`, el efecto que invoca la función (normalmente el render del
 * componente) se recalcula cuando cambia el día.
 *
 * @param strDate - Fecha a formatear (Date, string, o null/undefined).
 * @returns Texto formateado o null si la fecha es inválida.
 */
export function listTime(strDate: DateInput): string | null {
  const date = getDate(strDate)
  if (!date) return null

  ensureClock()
  day.value // Dependencia del render: refresca el texto al cambiar el día.

  return daysAgo(date) === 0
    ? useDateFormat(date, "HH:mm").value
    : useDateFormat(date, "DD/MM/YYYY HH:mm").value
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