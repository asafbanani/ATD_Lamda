import { useEffect, useMemo, useState } from "react"
import CalendarDayColumn from "../components/admin/CalendarDayColumn"
import ClassDetails from "../components/admin/ClassDetails"
import type { ClassSlot, Student } from "../models/types"
import {
  addDays,
  formatDisplayDate,
  fromISODate,
  getWeekRangeLabel,
  getWeekStart,
  isDateInWeek,
} from "../utils/dateUtils"
import AddClassForm from "../components/admin/AddClassForm"

type AdminDashboardProps = {
  classes: ClassSlot[]
  students: Student[]
  selectedClassId?: string
  onOpenClass: (classId: string) => void
  showClassModal: boolean
  onCloseClassModal: () => void
  weekOffset: number
  maxWeekOffset?: number
  onChangeWeek: (nextOffset: number) => void
  onCreateClass: (payload: { name: string; teacher: string; room: string; date: string; time: string; durationHours: number }) => void
  onAddStudentToClass: (classId: string, studentId: string) => void
  onRemoveStudentFromClass: (classId: string, studentId: string) => void
}

const dayOrder = ["\u05e8\u05d0\u05e9\u05d5\u05df", "\u05e9\u05e0\u05d9", "\u05e9\u05dc\u05d9\u05e9\u05d9", "\u05e8\u05d1\u05d9\u05e2\u05d9", "\u05d7\u05de\u05d9\u05e9\u05d9", "\u05e9\u05d9\u05e9\u05d9", "\u05e9\u05d1\u05ea"]

function AdminDashboard({
  classes,
  students,
  selectedClassId,
  onOpenClass,
  showClassModal,
  onCloseClassModal,
  weekOffset,
  maxWeekOffset = 4,
  onChangeWeek,
  onCreateClass,
  onAddStudentToClass,
  onRemoveStudentFromClass,
}: AdminDashboardProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAddStudentModal, setShowAddStudentModal] = useState(false)
  const [studentQuery, setStudentQuery] = useState("")
  const [selectedStudentId, setSelectedStudentId] = useState("")
  const weekStart = useMemo(() => getWeekStart(new Date(), weekOffset), [weekOffset])

  const classesThisWeek = useMemo(
    () => classes.filter((cls) => isDateInWeek(cls.date, weekStart)),
    [classes, weekStart],
  )

  const selectedClass = useMemo(
    () => classesThisWeek.find((cls) => cls.id === selectedClassId) ?? classesThisWeek[0],
    [classesThisWeek, selectedClassId],
  )

  useEffect(() => {
    if (!showClassModal) {
      setShowAddStudentModal(false)
      setStudentQuery("")
      setSelectedStudentId("")
    }
  }, [showClassModal])

  useEffect(() => {
    setShowAddStudentModal(false)
    setStudentQuery("")
    setSelectedStudentId("")
  }, [selectedClass?.id])

  const calendar = useMemo(() => {
    const extraDays = classesThisWeek
      .map((cls) => cls.day)
      .filter((day, index, arr) => !dayOrder.includes(day) && arr.indexOf(day) === index)
    const orderedDays = [...dayOrder, ...extraDays]

    return orderedDays.map((day) => {
      const slots = classesThisWeek
        .filter((cls) => cls.day === day)
        .sort((a, b) => a.time.localeCompare(b.time))
      const dayIndex = dayOrder.indexOf(day)
      const dateFromWeek = dayIndex >= 0 ? addDays(weekStart, dayIndex) : null
      const dateFromSlot = slots[0]?.date ? new Date(slots[0].date) : null
      const date = dateFromWeek ?? dateFromSlot
      return {
        day,
        slots,
        date: date ? formatDisplayDate(date) : null,
      }
    })
  }, [classesThisWeek, weekStart])

  const selectedStudents = useMemo(
    () =>
      selectedClass
        ? selectedClass.students
            .map((studentId) => students.find((student) => student.id === studentId))
            .filter((student): student is Student => Boolean(student))
        : [],
    [selectedClass, students],
  )

  const availableStudents = useMemo(
    () => (selectedClass ? students.filter((student) => !selectedClass.students.includes(student.id)) : []),
    [selectedClass, students],
  )

  const filteredAvailableStudents = useMemo(() => {
    const query = studentQuery.trim().toLowerCase()
    if (!query) return availableStudents
    return availableStudents.filter(
      (student) =>
        student.fullName.toLowerCase().includes(query) ||
        student.phone.includes(query) ||
        student.email?.toLowerCase().includes(query),
    )
  }, [availableStudents, studentQuery])

  const handleAddStudentToSelectedClass = () => {
    if (!selectedClass || !selectedStudentId) return
    onAddStudentToClass(selectedClass.id, selectedStudentId)
    setShowAddStudentModal(false)
    setStudentQuery("")
    setSelectedStudentId("")
  }

  const nextDate = selectedClass ? formatDisplayDate(fromISODate(selectedClass.date)) : null
  const weekLabel = getWeekRangeLabel(weekStart)

  return (
    <>
      <div className="calendar-layout">
        <section className="panel calendar-panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">{"\u05d9\u05d5\u05de\u05df \u05e9\u05d1\u05d5\u05e2\u05d9"}</p>
              <h2>{"\u05dc\u05d5\u05d7 \u05d4\u05e9\u05d1\u05d5\u05e2"}</h2>
              <p className="muted">{"\u05db\u05d9\u05ea\u05d5\u05ea \u05e2\u05dd \u05de\u05d5\u05e8\u05d9\u05dd \u05d5\u05d1\u05dc\u05d5\u05d7\u05d9\u05dd \u05d4\u05ea\u05d0\u05d9\u05de\u05d9\u05dd"}</p>
            </div>
            <div className="week-controls">
              <div className="week-label">
                <p className="eyebrow">{"\u05d8\u05d5\u05d5\u05d7 \u05e9\u05d1\u05d5\u05e2"}</p>
                <strong>{weekLabel}</strong>
              </div>
              <div className="week-buttons">
                <button
                  type="button"
                  className="pill ghost"
                  disabled={weekOffset === 0}
                  onClick={() => onChangeWeek(weekOffset - 1)}
                >
                  {"\u05e9\u05d1\u05d5\u05e2 \u05e7\u05d5\u05d3\u05dd"}
                </button>
                <button
                  type="button"
                  className="pill primary"
                  disabled={weekOffset >= maxWeekOffset}
                  onClick={() => onChangeWeek(Math.min(weekOffset + 1, maxWeekOffset))}
                >
                  {"\u05e9\u05d1\u05d5\u05e2 \u05d4\u05d1\u05d0"}
                </button>
                <button type="button" className="pill primary" onClick={() => setShowAddModal(true)}>
                  {"\u05d4\u05d5\u05e1\u05e4\u05ea \u05db\u05d9\u05ea\u05d4"}
                </button>
              </div>
            </div>
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
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-label="\u05d4\u05d5\u05e1\u05e4\u05ea \u05db\u05d9\u05ea\u05d4 \u05d7\u05d3\u05e9\u05d4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">{"\u05d0\u05d3\u05de\u05d9\u05df"}</p>
                <h3>{"\u05d4\u05d5\u05e1\u05e4\u05ea \u05db\u05d9\u05ea\u05d4 \u05dc\u05d9\u05d5\u05de\u05df \u05e0\u05d5\u05db\u05d7\u05d9"}</h3>
                <p className="muted">{"\u05e9\u05d9\u05e0\u05d5\u05d9 \u05d9\u05d5\u05de\u05df \u05d0\u05d5 \u05d7\u05d5\u05d3\u05e9 \u05db\u05d3\u05d9 \u05d1\u05d9\u05e0\u05d5\u05d9 \u05e9\u05d1\u05d5\u05e2\u05d9\u05dd \u05d1\u05e2\u05ea\u05d9\u05d3"}</p>
              </div>
              <button type="button" className="pill ghost" onClick={() => setShowAddModal(false)}>
                {"\u05e1\u05d2\u05d5\u05e8"}
              </button>
            </div>

            <AddClassForm
              classes={classes}
              weekStart={weekStart}
              maxWeekOffset={maxWeekOffset}
              onCreate={(payload) => {
                onCreateClass(payload)
                setShowAddModal(false)
              }}
            />
          </div>
        </div>
      )}

      {showClassModal && selectedClass && (
        <div className="modal-overlay" onClick={onCloseClassModal}>
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-label={selectedClass.name}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">
                  {selectedClass.day}
                  {nextDate ? ` | ${nextDate}` : ""}
                </p>
                <h3>{selectedClass.name}</h3>
              </div>
              <button type="button" className="pill ghost" onClick={onCloseClassModal}>
                {"\u05e1\u05d2\u05d5\u05e8"}
              </button>
            </div>
            <ClassDetails
              selectedClass={selectedClass}
              selectedStudents={selectedStudents}
              nextDate={nextDate}
              onOpenAddStudent={() => setShowAddStudentModal(true)}
              onRemoveStudent={(studentId) => onRemoveStudentFromClass(selectedClass.id, studentId)}
              canAddStudent={availableStudents.length > 0}
            />
          </div>
        </div>
      )}

      {showAddStudentModal && selectedClass && (
        <div className="modal-overlay" onClick={() => setShowAddStudentModal(false)}>
          <div
            className="modal-card small"
            role="dialog"
            aria-modal="true"
            aria-label="\u05d4\u05d5\u05e1\u05e4\u05ea \u05ea\u05dc\u05de\u05d9\u05d3 \u05dc\u05db\u05d9\u05ea\u05d4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">{"\u05d4\u05d5\u05e1\u05e4\u05ea \u05ea\u05dc\u05de\u05d9\u05d3"}</p>
                <h3>{selectedClass.name}</h3>
                <p className="muted">{"\u05d1\u05d7\u05e8\u05d5 \u05ea\u05dc\u05de\u05d9\u05d3 \u05e7\u05d9\u05d9\u05dd \u05d5\u05d4\u05d5\u05e1\u05d9\u05e4\u05d5 \u05d0\u05d5\u05ea\u05d5 \u05e4\u05d4"}</p>
              </div>
              <button type="button" className="pill ghost" onClick={() => setShowAddStudentModal(false)}>
                {"\u05e1\u05d2\u05d5\u05e8"}
              </button>
            </div>

            {availableStudents.length === 0 ? (
              <p className="muted">{"\u05d0\u05d9\u05df \u05ea\u05dc\u05de\u05d9\u05d3\u05d9\u05dd \u05e4\u05e0\u05d5\u05d9\u05d9\u05dd \u05d4\u05e8\u05d2\u05e2"}</p>
            ) : (
              <div className="add-student-card">
                <div className="form-grid">
                  <label>
                    {"\u05d7\u05d9\u05e4\u05d5\u05e9 \u05de\u05d4\u05d9\u05e8\u05d9 \u05d8\u05dc\u05de\u05d9\u05d3"}
                    <div className="search-box">
                      <input
                        type="text"
                        placeholder={"\u05d7\u05e4\u05e9 \u05e9\u05dd / \u05d8\u05dc\u05e4\u05d5\u05df / \u05d0\u05d9\u05de\u05d9\u05d9\u05dc"}
                        value={studentQuery}
                        onChange={(event) => {
                          setStudentQuery(event.target.value)
                          setSelectedStudentId("")
                        }}
                        list="admin-student-options"
                      />
                      <datalist id="admin-student-options">
                        {availableStudents.map((student) => (
                          <option key={student.id} value={`${student.fullName} | ${student.phone}`} />
                        ))}
                      </datalist>
                    </div>
                  </label>
                  <label>
                    {"\u05d1\u05d7\u05e8 \u05ea\u05dc\u05de\u05d9\u05d3"}
                    <select value={selectedStudentId} onChange={(event) => setSelectedStudentId(event.target.value)}>
                      <option value="">{'\u05d1\u05d7\u05e8\u05d5 \u05ea\u05dc\u05de\u05d9\u05d3'}</option>
                      {filteredAvailableStudents.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.fullName} | {student.phone}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="detail-row">
                  <p className="muted">
                    {filteredAvailableStudents.length === 0
                      ? "\u05d0\u05d9\u05df \u05ea\u05d5\u05e6\u05d0\u05d5\u05ea \u05dc\u05d7\u05d9\u05e4\u05d5\u05e9"
                      : `${filteredAvailableStudents.length} \u05ea\u05dc\u05de\u05d9\u05d3\u05d9\u05dd \u05d6\u05de\u05d9\u05e0\u05d9\u05dd`}
                  </p>
                  <button type="button" className="pill primary" disabled={!selectedStudentId} onClick={handleAddStudentToSelectedClass}>
                    {"\u05d4\u05d5\u05e1\u05e3"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default AdminDashboard
