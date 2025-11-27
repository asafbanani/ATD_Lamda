import { useMemo } from "react"
import CalendarDayColumn from "../components/admin/CalendarDayColumn"
import ClassDetails from "../components/admin/ClassDetails"
import type { ClassSlot, Student } from "../models/types"

type AdminDashboardProps = {
  classes: ClassSlot[]
  students: Student[]
  selectedClassId?: string
  onOpenClass: (classId: string) => void
}

const dayOrder = ["\u05e8\u05d0\u05e9\u05d5\u05df", "\u05e9\u05e0\u05d9", "\u05e9\u05dc\u05d9\u05e9\u05d9", "\u05e8\u05d1\u05d9\u05e2\u05d9", "\u05d7\u05de\u05d9\u05e9\u05d9", "\u05e9\u05d9\u05e9\u05d9"]
const dayToIndex: Record<string, number> = {
  ["\u05e8\u05d0\u05e9\u05d5\u05df"]: 0,
  ["\u05e9\u05e0\u05d9"]: 1,
  ["\u05e9\u05dc\u05d9\u05e9\u05d9"]: 2,
  ["\u05e8\u05d1\u05d9\u05e2\u05d9"]: 3,
  ["\u05d7\u05de\u05d9\u05e9\u05d9"]: 4,
  ["\u05e9\u05d9\u05e9\u05d9"]: 5,
  ["\u05e9\u05d1\u05ea"]: 6,
}

function AdminDashboard({ classes, students, selectedClassId, onOpenClass }: AdminDashboardProps) {
  const selectedClass = useMemo(
    () => classes.find((cls) => cls.id === selectedClassId) ?? classes[0],
    [classes, selectedClassId],
  )

  const calendar = useMemo(() => {
    const extraDays = classes
      .map((cls) => cls.day)
      .filter((day, index, arr) => !dayOrder.includes(day) && arr.indexOf(day) === index)
    const orderedDays = [...dayOrder, ...extraDays]

    return orderedDays.map((day) => {
      const slots = classes
        .filter((cls) => cls.day === day)
        .sort((a, b) => a.time.localeCompare(b.time))
      return {
        day,
        slots,
        date: formatNextDate(day),
      }
    })
  }, [classes])

  const selectedStudents = useMemo(
    () =>
      selectedClass
        ? selectedClass.students
            .map((studentId) => students.find((student) => student.id === studentId))
            .filter((student): student is Student => Boolean(student))
        : [],
    [selectedClass, students],
  )

  const nextDate = selectedClass ? formatNextDate(selectedClass.day) : null

  return (
    <div className="calendar-layout">
      <section className="panel calendar-panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">{"\u05d9\u05d5\u05de\u05df \u05e9\u05d1\u05d5\u05e2\u05d9"}</p>
            <h2>{"\u05dc\u05d5\u05d7 \u05d4\u05e9\u05d1\u05d5\u05e2"}</h2>
            <p className="muted">{"\u05db\u05d9\u05ea\u05d5\u05ea \u05e2\u05dd \u05de\u05d5\u05e8\u05d9\u05dd \u05d5\u05d1\u05dc\u05d5\u05d7\u05d9\u05dd \u05d4\u05ea\u05d0\u05d9\u05de\u05d9\u05dd"}</p>
          </div>
          <div className="badge">{`\u05db\u05d9\u05ea\u05d5\u05ea ${classes.length}`}</div>
        </div>

        <div className="calendar-grid">
          {calendar.map(({ day, slots, date }) => (
            <CalendarDayColumn
              key={day}
              day={day}
              date={date}
              slots={slots}
              selectedClassId={selectedClass?.id}
              onOpenClass={onOpenClass}
            />
          ))}
        </div>
      </section>

      <section className="panel detail-panel">
        <ClassDetails selectedClass={selectedClass} selectedStudents={selectedStudents} nextDate={nextDate} />
      </section>
    </div>
  )
}

function formatNextDate(dayName: string) {
  const targetIndex = dayToIndex[dayName]
  if (targetIndex === undefined) return null

  const today = new Date()
  const delta = (targetIndex - today.getDay() + 7) % 7
  const targetDate = new Date(today)
  targetDate.setDate(today.getDate() + delta)

  return targetDate.toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit" })
}

export default AdminDashboard
