import { useEffect, useMemo, useState } from "react"
import type { Student } from "../models/types"

type StudentsViewProps = {
  students: Student[]
  onAddStudent: (data: {
    firstName: string
    lastName: string
    phone: string
    email?: string
    parentName?: string
    parentPhone?: string
  }) => void
  onUpdateStudent: (id: string, data: Partial<Student>) => void
}

function StudentsView({ students, onAddStudent, onUpdateStudent }: StudentsViewProps) {
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(students[0]?.id ?? null)
  const [showForm, setShowForm] = useState(false)
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    parentName: "",
    parentPhone: "",
  })
  const [editState, setEditState] = useState<Student | null>(students[0] ?? null)

  const filteredStudents = useMemo(() => {
    const term = query.trim().toLowerCase()
    const list = students.filter((student) => {
      if (!term) return true
      return (
        student.fullName.toLowerCase().includes(term) ||
        student.phone.toLowerCase().includes(term) ||
        student.email?.toLowerCase().includes(term) ||
        student.parentName?.toLowerCase().includes(term) ||
        student.parentPhone?.toLowerCase().includes(term)
      )
    })
    return list
  }, [students, query])

  useEffect(() => {
    if (selectedId && filteredStudents.find((s) => s.id === selectedId)) return
    setSelectedId(filteredStudents[0]?.id ?? null)
  }, [filteredStudents, selectedId])

  const selectedStudent = useMemo(() => filteredStudents.find((student) => student.id === selectedId) ?? null, [selectedId, filteredStudents])

  useEffect(() => {
    if (selectedStudent) setEditState(selectedStudent)
    else setEditState(null)
  }, [selectedStudent])

  const canSubmit = formState.firstName.trim() && formState.lastName.trim() && formState.phone.trim()
  const hasEdits =
    editState &&
    selectedStudent &&
    (editState.firstName !== selectedStudent.firstName ||
      editState.lastName !== selectedStudent.lastName ||
      editState.phone !== selectedStudent.phone ||
      editState.email !== selectedStudent.email ||
      editState.parentName !== selectedStudent.parentName ||
      editState.parentPhone !== selectedStudent.parentPhone ||
      editState.hours !== selectedStudent.hours)

  return (
    <div className="panel students-panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">{"\u05ea\u05dc\u05de\u05d9\u05d3\u05d9\u05dd"}</p>
          <h2>{"\u05db\u05dc \u05d4\u05ea\u05dc\u05de\u05d9\u05d3\u05d9\u05dd"}</h2>
        </div>
        <button type="button" className="pill primary" onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? "\u05e1\u05d2\u05d5\u05e8" : "\u05d4\u05d5\u05e1\u05e4\u05ea \u05ea\u05dc\u05de\u05d9\u05d3"}
        </button>
      </div>

      <div className="students-layout">
        <div className="students-list">
          <div className="search-box">
            <input
              type="text"
              placeholder={"\u05d7\u05e4\u05e9 \u05ea\u05dc\u05de\u05d9\u05d3 / \u05d4\u05d5\u05e8\u05d4"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {filteredStudents.map((student) => (
            <button
              key={student.id}
              type="button"
              className={student.id === selectedId ? "student-tile active" : "student-tile"}
              onClick={() => setSelectedId(student.id)}
            >
              <strong>{student.fullName}</strong>
              <span className="muted">{student.phone}</span>
            </button>
          ))}
          {students.length === 0 && <p className="muted">{"\u05e2\u05d3\u05d9\u05d9\u05df \u05d0\u05d9\u05df \u05ea\u05dc\u05de\u05d9\u05d3\u05d9\u05dd"}</p>}
          {students.length > 0 && filteredStudents.length === 0 && <p className="muted">{"\u05d0\u05d9\u05df \u05ea\u05d5\u05e6\u05d0\u05d5\u05ea \u05dc\u05e4\u05d9 \u05d4\u05d7\u05d9\u05e4\u05d5\u05e9"}</p>}
        </div>

        <div className="students-details">
          {selectedStudent ? (
            <div className="detail-card">
              <h3>{selectedStudent.fullName}</h3>
              <div className="form-grid">
                <label>
                  {"\u05e9\u05dd \u05e4\u05e8\u05d8\u05d9"}
                  <input
                    type="text"
                    value={editState?.firstName ?? ""}
                    onChange={(e) => setEditState((prev) => (prev ? { ...prev, firstName: e.target.value } : prev))}
                  />
                </label>
                <label>
                  {"\u05e9\u05dd \u05de\u05e9\u05e4\u05d7\u05d4"}
                  <input
                    type="text"
                    value={editState?.lastName ?? ""}
                    onChange={(e) => setEditState((prev) => (prev ? { ...prev, lastName: e.target.value } : prev))}
                  />
                </label>
                <label>
                  {"\u05d8\u05dc\u05e4\u05d5\u05df"}
                  <input
                    type="text"
                    value={editState?.phone ?? ""}
                    onChange={(e) => setEditState((prev) => (prev ? { ...prev, phone: e.target.value } : prev))}
                  />
                </label>
                <label>
                  {"\u05d0\u05d9\u05de\u05d9\u05d9\u05dc"}
                  <input
                    type="email"
                    value={editState?.email ?? ""}
                    onChange={(e) => setEditState((prev) => (prev ? { ...prev, email: e.target.value } : prev))}
                  />
                </label>
                <label>
                  {"\u05e9\u05dd \u05d4\u05d5\u05e8\u05d4"}
                  <input
                    type="text"
                    value={editState?.parentName ?? ""}
                    onChange={(e) => setEditState((prev) => (prev ? { ...prev, parentName: e.target.value } : prev))}
                  />
                </label>
                <label>
                  {"\u05d8\u05dc\u05e4\u05d5\u05df \u05d4\u05d5\u05e8\u05d4"}
                  <input
                    type="text"
                    value={editState?.parentPhone ?? ""}
                    onChange={(e) => setEditState((prev) => (prev ? { ...prev, parentPhone: e.target.value } : prev))}
                  />
                </label>
                <label>
                  {"\u05e9\u05e2\u05d5\u05ea"}
                  <input
                    type="number"
                    value={editState?.hours ?? 0}
                    onChange={(e) =>
                      setEditState((prev) => (prev ? { ...prev, hours: Number(e.target.value) || 0 } : prev))
                    }
                  />
                </label>
                <label>
                  {"\u05d9\u05ea\u05e8\u05d4 (\u05d7\u05d5\u05d1 - \u05e7\u05e8\u05d9\u05d0\u05d4 \u05d9\u05d3\u05e0\u05d9)"}
                  <input type="number" value={selectedStudent.balance} disabled />
                </label>
              </div>
              <div className="detail-row">
                <span className="badge">{editState?.phone || "\u05e8\u05d9\u05e7"}</span>
                <span className="badge subtle">
                  {(editState?.parentName || "") + (editState?.parentPhone ? ` | ${editState.parentPhone}` : "") || "\u05e8\u05d9\u05e7"}
                </span>
              </div>
              <button
                type="button"
                className="pill primary"
                disabled={!hasEdits || !editState?.firstName || !editState?.lastName || !editState?.phone}
                onClick={() => {
                  if (!editState) return
                  onUpdateStudent(editState.id, {
                    firstName: editState.firstName,
                    lastName: editState.lastName,
                    fullName: `${editState.firstName ?? ""} ${editState.lastName ?? ""}`.trim() || editState.fullName,
                    phone: editState.phone,
                    email: editState.email,
                    parentName: editState.parentName,
                    parentPhone: editState.parentPhone,
                    hours: editState.hours ?? 0,
                  })
                }}
              >
                {"\u05e9\u05de\u05d9\u05e8\u05d4 \u05e2\u05d3\u05db\u05d5\u05e0\u05d9\u05dd"}
              </button>
            </div>
          ) : (
            <div className="empty-state">
              <p>{"\u05d1\u05d7\u05e8\u05d5 \u05ea\u05dc\u05de\u05d9\u05d3 \u05de\u05d4\u05e8\u05e9\u05d9\u05de\u05d4"}</p>
            </div>
          )}

          {showForm && (
            <div className="add-student-card">
              <h3>{"\u05d4\u05d5\u05e1\u05e4\u05ea \u05ea\u05dc\u05de\u05d9\u05d3 \u05d7\u05d3\u05e9"}</h3>
              <div className="form-grid">
                <label>
                  {"\u05e9\u05dd \u05e4\u05e8\u05d8\u05d9"}
                  <input
                    type="text"
                    value={formState.firstName}
                    onChange={(e) => setFormState((prev) => ({ ...prev, firstName: e.target.value }))}
                  />
                </label>
                <label>
                  {"\u05e9\u05dd \u05de\u05e9\u05e4\u05d7\u05d4"}
                  <input
                    type="text"
                    value={formState.lastName}
                    onChange={(e) => setFormState((prev) => ({ ...prev, lastName: e.target.value }))}
                  />
                </label>
                <label>
                  {"\u05d8\u05dc\u05e4\u05d5\u05df"}
                  <input
                    type="text"
                    value={formState.phone}
                    onChange={(e) => setFormState((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </label>
                <label>
                  {"\u05d0\u05d9\u05de\u05d9\u05d9\u05dc (\u05d0\u05d5\u05e4\u05e6\u05d9\u05d5\u05e0\u05dc\u05d9)"}
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </label>
                <label>
                  {"\u05d4\u05d5\u05e8\u05d4 \u05d0\u05d1/\u05d0\u05dd (\u05d0\u05d5\u05e4\u05e6\u05d9\u05d5\u05e0\u05dc\u05d9)"}
                  <input
                    type="text"
                    value={formState.parentName}
                    onChange={(e) => setFormState((prev) => ({ ...prev, parentName: e.target.value }))}
                  />
                </label>
                <label>
                  {"\u05d8\u05dc\u05e4\u05d5\u05df \u05d4\u05d5\u05e8\u05d4 (\u05d0\u05d5\u05e4\u05e6\u05d9\u05d5\u05e0\u05dc\u05d9)"}
                  <input
                    type="text"
                    value={formState.parentPhone}
                    onChange={(e) => setFormState((prev) => ({ ...prev, parentPhone: e.target.value }))}
                  />
                </label>
              </div>
              <button
                type="button"
                className="pill primary"
                disabled={!canSubmit}
                onClick={() => {
                  onAddStudent(formState)
                  setFormState({
                    firstName: "",
                    lastName: "",
                    phone: "",
                    email: "",
                    parentName: "",
                    parentPhone: "",
                  })
                  setShowForm(false)
                }}
              >
                {"\u05d4\u05d5\u05e1\u05e3"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentsView
