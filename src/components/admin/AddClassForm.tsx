import { useEffect, useMemo, useState } from "react"
import type { ClassSlot } from "../../models/types"
import { addDays, getWeekStart, isDateInWeek, toISODate } from "../../utils/dateUtils"

type AddClassFormProps = {
  classes: ClassSlot[]
  weekStart: Date
  maxWeekOffset?: number
  onCreate: (payload: { name: string; teacher: string; room: string; date: string; time: string; durationHours: number }) => void
}

const baseTimeOptions = Array.from({ length: 29 }, (_, idx) => {
  const totalMinutes = 8 * 60 + idx * 30
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${`${hours}`.padStart(2, "0")}:${`${minutes}`.padStart(2, "0")}`
}).filter((time) => {
  const [h] = time.split(":").map(Number)
  return h <= 22
})
const durationOptions = [0.5, 1, 1.5, 2, 2.5, 3]

function timeToMinutes(timeStr: string) {
  const [h, m] = timeStr.split(":").map(Number)
  return h * 60 + m
}

function addMinutesToTimeLabel(timeStr: string, minutesToAdd: number) {
  const [h, m] = timeStr.split(":").map(Number)
  const date = new Date()
  date.setHours(h, m, 0, 0)
  date.setMinutes(date.getMinutes() + minutesToAdd)
  const hh = `${date.getHours()}`.padStart(2, "0")
  const mm = `${date.getMinutes()}`.padStart(2, "0")
  return `${hh}:${mm}`
}

function AddClassForm({ classes, weekStart, maxWeekOffset = 4, onCreate }: AddClassFormProps) {
  const classNames = useMemo(() => Array.from(new Set(classes.map((cls) => cls.name))), [classes])
  const teachers = useMemo(() => Array.from(new Set(classes.map((cls) => cls.teacher))), [classes])
  const rooms = useMemo(() => Array.from(new Set(classes.map((cls) => cls.room))), [classes])
  const timeOptions = useMemo(
    () => Array.from(new Set([...baseTimeOptions, ...classes.map((cls) => cls.time)])).sort(),
    [classes],
  )

  const baseWeekStart = useMemo(() => getWeekStart(), [])
  const minDate = toISODate(baseWeekStart)
  const maxDate = toISODate(addDays(baseWeekStart, maxWeekOffset * 7 + 6))

  const [name, setName] = useState(classNames[0] ?? "")
  const [teacher, setTeacher] = useState(teachers[0] ?? "")
  const [room, setRoom] = useState(rooms[0] ?? "\u05d7\u05d3\u05e8 1")
  const [date, setDate] = useState(toISODate(weekStart))
  const [time, setTime] = useState(timeOptions[0] ?? "")
  const [durationHours, setDurationHours] = useState(1)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Keep the date aligned with the selected week but within allowed range
    const nextDefault = toISODate(weekStart)
    const insideCurrentWeek = isDateInWeek(date, weekStart)
    if (!insideCurrentWeek || date < minDate || date > maxDate) {
      setDate(nextDefault)
    }
  }, [date, maxDate, minDate, weekStart])

  const busyRanges = useMemo(
    () =>
      classes
        .filter((cls) => cls.date === date && cls.name === name)
        .map((cls) => {
          const duration = cls.durationHours && cls.durationHours > 0 ? cls.durationHours : 1
          const startMinutes = timeToMinutes(cls.time)
          const endMinutes = startMinutes + duration * 60
          return {
            start: startMinutes,
            end: endMinutes,
            label: `${cls.time} - ${addMinutesToTimeLabel(cls.time, duration * 60)}`,
          }
        }),
    [classes, date, name],
  )

  const isBlocked = (timeOption: string) => {
    const start = timeToMinutes(timeOption)
    const end = start + durationHours * 60
    return busyRanges.some((range) => start < range.end && end > range.start)
  }

  const busyTimes = useMemo(
    () => Array.from(new Set(busyRanges.map((range) => range.label))),
    [busyRanges],
  )

  useEffect(() => {
    // Auto-pick the first available time if the current one is blocked
    if (isBlocked(time)) {
      const firstFree = timeOptions.find((option) => !isBlocked(option))
      setTime(firstFree ?? "")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busyRanges, durationHours, time, timeOptions])

  const canSubmit = Boolean(name && teacher && date && time && !isBlocked(time))

  return (
    <div className="add-class-form-wrap">
      <form
        className="add-class-form"
        onSubmit={(event) => {
          event.preventDefault()
          if (!canSubmit) {
            setError("\u05d1\u05d7\u05e8\u05d5 \u05d7\u05d5\u05e4\u05e9\u05d9\u05dd \u05d5\u05d6\u05de\u05df \u05e4\u05e0\u05d5\u05d9")
            return
          }
          setError(null)
          onCreate({
            name,
            teacher,
            room: room || "\u05d7\u05d3\u05e8 1",
            date,
            time,
            durationHours,
          })
        }}
      >
        <label>
          <span>{"\u05e9\u05dd \u05d4\u05db\u05d9\u05ea\u05d4 \u05d1\u05de\u05e2\u05e8\u05db\u05ea"}</span>
          <select value={name} onChange={(event) => setName(event.target.value)}>
            {classNames.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>{"\u05d1\u05d7\u05d9\u05e8\u05ea \u05de\u05d5\u05e8\u05d4"}</span>
          <select value={teacher} onChange={(event) => setTeacher(event.target.value)}>
            {teachers.map((teacherName) => (
              <option key={teacherName} value={teacherName}>
                {teacherName}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>{"\u05d1\u05d7\u05d9\u05e8\u05ea \u05d7\u05d3\u05e8"}</span>
          <select value={room} onChange={(event) => setRoom(event.target.value)}>
            {rooms.map((roomOption) => (
              <option key={roomOption} value={roomOption}>
                {roomOption}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>{"\u05ea\u05d0\u05e8\u05d9\u05da \u05d4\u05db\u05d9\u05ea\u05d4"}</span>
          <input
            type="date"
            min={minDate}
            max={maxDate}
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>

        <label>
          <span>{"\u05d6\u05de\u05df \u05d4\u05db\u05d9\u05ea\u05d4"}</span>
          <select value={time} onChange={(event) => setTime(event.target.value)}>
            {timeOptions.map((option) => {
              const blocked = isBlocked(option)
              return (
                <option key={option} value={option} disabled={blocked}>
                  {blocked ? `${option} - \u05ea\u05e4\u05d5\u05e1` : option}
                </option>
              )
            })}
          </select>
        </label>

        <label>
          <span>{"\u05de\u05e1\u05e4\u05e8 \u05e9\u05e2\u05d5\u05ea"}</span>
          <select value={durationHours} onChange={(event) => setDurationHours(Number(event.target.value))}>
            {durationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div className="busy-times">
          <div className="busy-head">
            <p className="eyebrow">{"\u05e9\u05e2\u05d5\u05ea \u05d1\u05d4\u05df \u05db\u05d9\u05ea\u05d4 \u05ea\u05e4\u05d5\u05e1\u05d4 \u05d1\u05ea\u05d0\u05e8\u05d9\u05da \u05d6\u05d4"}</p>
          </div>
          {busyTimes.length > 0 && (
            <div className="chip-row">
              {busyTimes.map((busy) => (
                <span key={busy} className="badge warning">
                  {busy}
                </span>
              ))}
            </div>
          )}
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="add-class-actions">
          <button type="submit" className="pill primary" disabled={!canSubmit}>
            {"\u05d4\u05d5\u05e1\u05e4\u05d4 \u05d4\u05db\u05d9\u05ea\u05d4"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddClassForm
