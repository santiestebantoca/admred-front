import { useDateFormat } from "@vueuse/core"
import { ref, watch } from "vue"

const getDate = val =>
  val instanceof Date
    ? val
    : val ? new Date(val) : null

const daysAgo = val => {
  const date = getDate(val)
  if (date) {
    const timeDelta = new Date().getTime() - date.getTime()
    return Math.round(timeDelta / (1000 * 3600 * 24))
  }
}

let now = new Date()
const day = ref(now.getDate())
// const hour = ref(now.getHours())
// const min = ref(now.getMinutes())
setInterval(() => {
  now = new Date()
  day.value = now.getDate()
  // hour.value = now.getHours()
  // min.value = now.getMinutes()
}, 1000)

export function shorterTime(date) {
  const res = ref(null)
  if (date) {
    watch(day, () => {
      const ago = daysAgo(date)
      if (ago === 0) res.value = useDateFormat(date, 'HH:mm').value
      else if (ago === 1) res.value = 'Ayer'
      else res.value = useDateFormat(date, 'DD/MM/YYYY').value
    }, { immediate: true })
  }
  return res
}

export function listTime(date) {
  const res = ref(null)
  if (date) {
    watch(day, () => {
      if (daysAgo(date) === 0) res.value = useDateFormat(date, 'HH:mm').value
      else res.value = useDateFormat(date, 'DD/MM/YYYY HH:mm').value
    }, { immediate: true })
  }
  return res
}

export function formatTime(date) {
  if (date)
    return useDateFormat(date, 'DD/MM/YYYY HH:mm').value
}

export function formatDate(date) {
  if (date)
    return useDateFormat(date, 'DD/MM/YYYY').value
}

export function formatHM(date) {
  if (date)
    return useDateFormat(date, 'HH:mm').value
}