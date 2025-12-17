import { useState } from "react"
import AddExistingStudent from "../components/teacher/AddExistingStudent"
import StudentRow from "../components/teacher/StudentRow"
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
  onSendCharges: (payload: {
    classId: string
    className?: string
    teacherName?: string
    charges: { studentId: string; type: "half" | "full" }[]
  }) => void
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
  onSendCharges,
}: TeacherViewProps) {
  const selectedClass = classes.find((cls) => cls.id === selectedClassId)
  const [pendingCharges, setPendingCharges] = useState<Record<string, "half" | "full">>({})
  const [sentCharges, setSentCharges] = useState<Record<string, "half" | "full">>({})
  const [sendMessage, setSendMessage] = useState<string | null>(null)
  const hasMarkedAttendance = selectedClass
    ? Object.values(attendance[selectedClassId] ?? {}).some(Boolean)
    : false

  const clearChargesForClass = (classId: string) => {
    setPendingCharges((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((key) => {
        if (key.startsWith(`${classId}-`)) delete next[key]
      })
      return next
    })
    setSentCharges((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((key) => {
        if (key.startsWith(`${classId}-`)) delete next[key]
      })
      return next
    })
    setSendMessage(null)
  }

  return (
    <div className="panel teacher-card">
      <div className="weekly-strip">
        <div>
          <p className="eyebrow">{"\u05de\u05e1\u05da \u05de\u05d5\u05e8\u05d4"}</p>
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
          <p className="eyebrow">{"\u05db\u05d9\u05ea\u05d4 \u05e0\u05d5\u05db\u05d7\u05d9\u05ea"}</p>
          <h2>{selectedClass?.name ?? "\u05d1\u05d7\u05e8\u05d5 \u05db\u05d9\u05ea\u05d4"}</h2>
          <p className="muted">
            {selectedClass?.teacher} | {selectedClass?.day} | {selectedClass?.time}
          </p>
        </div>
        <div className="class-meta">
          <div className="badge">{"\u05e0\u05d5\u05db\u05d7\u05d5\u05ea \u05d7\u05d9\u05d9\u05d4"}</div>
          <div className="badge">{selectedClass?.room}</div>
        </div>
      </div>

      <div className="attendance">
        <div className="attendance-head">
          <h3>{"\u05e0\u05d5\u05db\u05d7\u05d5\u05ea"}</h3>
          <div className="attendance-actions">
            <button
              type="button"
              className="pill secondary"
              onClick={() => {
                if (!selectedClass) return
                onClearClass(selectedClass.id)
                clearChargesForClass(selectedClass.id)
              }}
            >
              {"\u05d0\u05d9\u05e4\u05d5\u05e1"}
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
              <StudentRow
                key={studentId}
                student={student}
                studentId={studentId}
                isPresent={isPresent}
                pendingCharge={pendingCharge}
                sentCharge={sentCharge}
                onToggleAttendance={() => onToggleAttendance(selectedClassId, studentId)}
                onSetPendingCharge={(amount) =>
                  setPendingCharges((prev) => {
                    setSendMessage(null)
                    return {
                      ...prev,
                      [key]: amount,
                    }
                  })
                }
              />
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
              if (!selectedClass) return
              const charges = Object.entries(pendingCharges)
                .filter(([key]) => key.startsWith(`${selectedClassId}-`))
                .map(([key, type]) => {
                  const dashIndex = key.indexOf("-")
                  const studentId = dashIndex >= 0 ? key.slice(dashIndex + 1) : key
                  return { studentId, type }
                })
              if (charges.length === 0) return
              onSendCharges({
                classId: selectedClassId,
                className: selectedClass?.name,
                teacherName,
                charges,
              })
              setSentCharges((prev) => ({ ...prev, ...pendingCharges }))
              setPendingCharges({})
              setSendMessage("\u05d4\u05d7\u05d9\u05d9\u05d5\u05d1\u05d9\u05dd \u05e0\u05db\u05dc\u05dc\u05d5 \u05dc\u05db\u05e8\u05d8\u05e1\u05ea \u05d4\u05d7\u05e9\u05d1\u05d5\u05e0\u05d5\u05ea")
            }}
          >
            {"\u05e9\u05dc\u05d7 \u05d7\u05d9\u05d5\u05d1\u05d9\u05dd \u05de\u05de\u05ea\u05d9\u05e0\u05d9\u05dd"}
          </button>
          {!hasMarkedAttendance && Object.keys(pendingCharges).length === 0 && (
            <span className="muted">{"\u05d0\u05d9\u05df \u05d7\u05d9\u05d5\u05d1\u05d9\u05dd \u05d0\u05d5 \u05ea\u05dc\u05de\u05d9\u05d3\u05d9\u05dd \u05e0\u05d1\u05d7\u05e8\u05d9\u05dd"}</span>
          )}
          {sendMessage && <span className="muted">{sendMessage}</span>}
        </div>
      </div>
    </div>
  )
}

export default TeacherView
