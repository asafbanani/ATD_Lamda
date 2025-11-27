import type { ClassSlot } from "../../models/types"

type CalendarDayColumnProps = {
  day: string
  date?: string | null
  slots: ClassSlot[]
  selectedClassId?: string
  onOpenClass: (classId: string) => void
}

function CalendarDayColumn({ day, date, slots, selectedClassId, onOpenClass }: CalendarDayColumnProps) {
  return (
    <div className="day-column">
      <div className="day-header">
        <div>
          <p className="eyebrow">{"\u05d9\u05d5\u05dd"}</p>
          <h4>{day}</h4>
        </div>
        {date ? <span className="badge subtle">{date}</span> : <span className="badge subtle">{"\u05d9\u05d5\u05dd \u05e4\u05e0\u05d5\u05d9"}</span>}
      </div>

      <div className="slot-stack">
        {slots.length === 0 && <div className="empty-slot">{"\u05d0\u05d9\u05df \u05db\u05d9\u05ea\u05d5\u05ea \u05d1\u05e7\u05d5\u05d5\u05da \u05d6\u05d4"}</div>}
        {slots.map((cls) => (
          <button
            key={cls.id}
            type="button"
            className={cls.id === selectedClassId ? "slot-card active" : "slot-card"}
            onClick={() => onOpenClass(cls.id)}
          >
            <div className="slot-time">{cls.time}</div>
            <div className="slot-main">
              <strong>{cls.name}</strong>
              <p className="muted">{cls.teacher}</p>
            </div>
            <div className="slot-meta">
              <span>{cls.room}</span>
              <span>{`${cls.students.length} \u05ea\u05dc\u05de\u05d9\u05d3\u05d9\u05dd`}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default CalendarDayColumn
