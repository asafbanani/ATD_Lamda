const hebrewDays = ["\u05e8\u05d0\u05e9\u05d5\u05df", "\u05e9\u05e0\u05d9", "\u05e9\u05dc\u05d9\u05e9\u05d9", "\u05e8\u05d1\u05d9\u05e2\u05d9", "\u05d7\u05de\u05d9\u05e9\u05d9", "\u05e9\u05d9\u05e9\u05d9", "\u05e9\u05d1\u05ea"]

export function getWeekStart(baseDate: Date = new Date(), offsetWeeks = 0) {
  const start = new Date(baseDate)
  const day = start.getDay()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - day + offsetWeeks * 7)
  return start
}

export function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(date.getDate() + days)
  return next
}

export function toISODate(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function fromISODate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number)
  return new Date(year, (month || 1) - 1, day || 1)
}

export function formatDisplayDate(date: Date) {
  return date.toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit" })
}

export function getDayNameFromDate(date: Date) {
  return hebrewDays[date.getDay()] ?? ""
}

export function getDayIndexByName(dayName: string) {
  return hebrewDays.indexOf(dayName)
}

export function getDateForDayName(weekStart: Date, dayName: string) {
  const index = getDayIndexByName(dayName)
  if (index === -1) return null
  return addDays(weekStart, index)
}

export function isSameDate(dateA: string, dateB: string) {
  return new Date(dateA).toDateString() === new Date(dateB).toDateString()
}

export function isDateInWeek(date: string, weekStart: Date) {
  const target = fromISODate(date)
  const start = new Date(weekStart)
  const end = addDays(start, 7)
  return target >= start && target < end
}

export function getWeekRangeLabel(weekStart: Date) {
  const end = addDays(weekStart, 6)
  return `${formatDisplayDate(weekStart)} - ${formatDisplayDate(end)}`
}

export function clampWeekOffset(offset: number, min = 0, max = 4) {
  if (offset < min) return min
  if (offset > max) return max
  return offset
}
