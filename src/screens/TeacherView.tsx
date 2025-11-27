import { useState } from "react"
import type { AttendanceMap, ClassSlot, Student } from "../models/types"

type TeacherViewProps = {
  classes: ClassSlot[]
  teacherName?: string
  selectedClassId: string
  attendance: AttendanceMap
  onSelectClass: (classId: string) => void
  onToggleAttendance: (classId: string, studentId: string) => void
  onAddStudent: (classId: string, studentId: string) => void
  availableStudents: Student[]
  studentsLookup: Student[]
  onClearClass: (classId: string) => void
}

function TeacherView({
  classes,
  teacherName,
  selectedClassId,
  attendance,
  onSelectClass,
  onToggleAttendance,
  onAddStudent,
  availableStudents,
  studentsLookup,
  onClearClass,
}: TeacherViewProps) {
  const selectedClass = classes.find((cls) => cls.id === selectedClassId)
  const [pendingCharges, setPendingCharges] = useState<Record<string, "half" | "full">>({})
  const [sentCharges, setSentCharges] = useState<Record<string, "half" | "full">>({})

  return (
    <div className="panel teacher-card">
      <div className="weekly-strip">
        <div>
          <p className="eyebrow">{"יום שבועי למורה"}</p>
          <h3>{teacherName ?? selectedClass?.teacher}</h3>
        </div>
        <div className="chip-row">
          {classes.map((cls) => (
            <button
              key={cls.id}
              type="button"
              className={cls.id === selectedClassId ? "pill active" : "pill secondary"}
              onClick={() => onSelectClass(cls.id)}
            >
              {cls.name} | {cls.day} | {cls.time}
            </button>
          ))}
        </div>
      </div>

      <div className="section-head">
        <div>
          <p className="eyebrow">{"מסך מורה"}</p>
          <h2>{selectedClass?.name ?? "כיתה"}</h2>
          <p className="muted">
            {selectedClass?.teacher} | {selectedClass?.day} | {selectedClass?.time}
          </p>
        </div>
        <div className="class-meta">
          <div className="badge">{"שיעור קבוע"}</div>
          <div className="badge">{selectedClass?.room}</div>
        </div>
      </div>

      <div className="attendance">
        <div className="attendance-head">
          <h3>{"נוכחות"}</h3>
          <div className="attendance-actions">
            <button
              type="button"
              className="pill secondary"
              onClick={() => {
                if (!selectedClass) return
                onClearClass(selectedClass.id)
                setPendingCharges((prev) => {
                  const next = { ...prev }
                  Object.keys(next).forEach((key) => {
                    if (key.startsWith(`${selectedClass.id}-`)) delete next[key]
                  })
                  return next
                })
                setSentCharges((prev) => {
                  const next = { ...prev }
                  Object.keys(next).forEach((key) => {
                    if (key.startsWith(`${selectedClass.id}-`)) delete next[key]
                  })
                  return next
                })
              }}
            >
              {"נקה"}
            </button>
          </div>
        </div>

        <div className="student-table">
          {(selectedClass?.students ?? []).map((studentId) => {
            const student = studentsLookup.find((s) => s.id === studentId)
            const isPresent = attendance[selectedClassId]?.[studentId] ?? false
            const key = `${selectedClassId}-${studentId}`
            const pendingCharge = pendingCharges[key]
            const sentCharge = sentCharges[key]
            return (
              <div key={studentId} className="student-row">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={isPresent}
                    onChange={() => onToggleAttendance(selectedClassId, studentId)}
                  />
                  <span />
                </label>
                <div className="student-meta">
                  <strong>{student?.fullName ?? "תלמיד"}</strong>
                  <p className="muted">{student?.phone}</p>
                </div>
                <span className={`status ${isPresent ? "ok" : "pending"}`}>
                  {isPresent ? "הגיע" : "ממתין"}
                </span>
                <div className="charge-actions">
                  {isPresent &&
                    (sentCharge ? (
                      <span className="badge">
                        {"נשלח לאדמין"} · {sentCharge === "full" ? "שיעור מלא" : "חצי שיעור"}
                      </span>
                    ) : pendingCharge ? (
                      <span className="badge">
                        {"מוכן לשליחה"} · {pendingCharge === "full" ? "שיעור מלא" : "חצי שיעור"}
                      </span>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="pill secondary"
                          onClick={() =>
                            setPendingCharges((prev) => ({
                              ...prev,
                              [key]: "half",
                            }))
                          }
                        >
                          {"חצי שיעור"}
                        </button>
                        <button
                          type="button"
                          className="pill primary"
                          onClick={() =>
                            setPendingCharges((prev) => ({
                              ...prev,
                              [key]: "full",
                            }))
                          }
                        >
                          {"שיעור מלא"}
                        </button>
                      </>
                    ))}
                </div>
              </div>
            )
          })}
        </div>

        <AddExistingStudent
          availableStudents={availableStudents}
          onAdd={(studentId) => selectedClass && onAddStudent(selectedClass.id, studentId)}
        />

        <div className="send-bar">
          <button
            type="button"
            className="pill primary"
            disabled={Object.keys(pendingCharges).length === 0}
            onClick={() => {
              // future: send to admin ledger with pendingCharges
              setSentCharges((prev) => ({ ...prev, ...pendingCharges }))
              setPendingCharges({})
            }}
          >
            {"שלח חיובים לאדמין"}
          </button>
          {Object.keys(pendingCharges).length === 0 && (
            <span className="muted">{"בחר חצי/מלא כדי לשלוח חיובים"}</span>
          )}
        </div>
      </div>
    </div>
  )
}

type AddExistingStudentProps = {
  availableStudents: Student[]
  onAdd: (studentId: string) => void
}

function AddExistingStudent({ availableStudents, onAdd }: AddExistingStudentProps) {
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState("")

  const filtered = availableStudents.filter(
    (student) =>
      student.fullName.includes(query) ||
      student.phone.includes(query) ||
      student.email?.includes(query),
  )

  return (
    <div className="add-student">
      <div>
        <p className="eyebrow">{"הוספת תלמיד קיים"}</p>
        <p className="muted">{"חיפוש מתוך המערכת והוספה לכיתה הנוכחית"}</p>
      </div>
      <div className="add-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder={"הקלד שם / טלפון"}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setSelectedId("")
            }}
            list="student-options"
          />
          <datalist id="student-options">
            {filtered.map((student) => (
              <option key={student.id} value={student.fullName} />
            ))}
          </datalist>
        </div>
        <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
          <option value="">{'בחר תלמיד'}</option>
          {filtered.map((student) => (
            <option key={student.id} value={student.id}>
              {student.fullName} | {student.phone}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="pill primary"
          disabled={!selectedId}
          onClick={() => {
            if (!selectedId) return
            onAdd(selectedId)
            setSelectedId("")
            setQuery("")
          }}
        >
          {"הוסף"}
        </button>
      </div>
    </div>
  )
}

export default TeacherView
