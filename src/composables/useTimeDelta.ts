/** Valor de fecha aceptado por los cálculos: Date, texto del backend o epoch. */
type DateInput = Date | string | number | null | undefined

export const timeDelta = (s: DateInput, e?: DateInput): number => {
  if (!s) return 0
  const start = new Date(s)
  const end = e ? new Date(e) : new Date()
  if (end < start) return 0
  return Math.trunc((end.getTime() - start.getTime()) / 60000)
}

export const timeDeltaW = (s: DateInput, e?: DateInput): number => {
  if (!s) return 0
  const start = new Date(s)
  const end = e ? new Date(e) : new Date()
  if (end < start) return 0
  let currentDay: number
  let currentDayWorkable: boolean
  let currentDayFriday: boolean
  let topHour: number
  let minutes = 0
  const current = new Date(start.getTime())
  current.setTime(current.getTime() + 60000)
  while (current < end) {
    currentDay = current.getDay()
    currentDayWorkable = currentDay > 0 && currentDay < 6
    currentDayFriday = currentDay === 5
    topHour = currentDayFriday ? 16.5 : 17.5
    if (currentDayWorkable) {
      const h = current.getHours() + current.getMinutes() / 60
      if ((h >= 8 && h < 12) || (h >= 12.5 && h < topHour)) minutes++
    }
    current.setTime(current.getTime() + 60000)
  }
  return minutes
}

export const timeDeltaToDH = (val: number): string => {
  const days = Math.trunc(val / 1440) // Each day (24h * 60) = 1440min
  const hours = Math.trunc((val % 1440) / 60)
  return days ? `${days}d ${hours}h` : `${hours}h`
}

export const timeDeltaWToDH = (val: number): string => {
  const days = Math.trunc(val / 528) // Each day (9|8h * 60) ~ 528min
  const hours = Math.trunc((val % 528) / 60)
  return days ? `${days}d ${hours}h` : `${hours}h`
}

export const timeDeltaDH = (s: DateInput, e?: DateInput): string => {
  return timeDeltaToDH(timeDelta(s, e))
}

export const timeDeltaWDH = (s: DateInput, e?: DateInput): string => {
  return timeDeltaWToDH(timeDeltaW(s, e))
}
