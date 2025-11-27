import { useState } from "react"
import type { Student } from "../../models/types"

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
        <p className="eyebrow">{"\u05d4\u05d5\u05e1\u05e4\u05ea \u05ea\u05dc\u05de\u05d9\u05d3 \u05e7\u05d9\u05d9\u05dd"}</p>
        <p className="muted">{"\u05d7\u05e4\u05e9\u05d5 \u05ea\u05dc\u05de\u05d9\u05d3 \u05dc\u05e4\u05d9 \u05e9\u05dd, \u05d8\u05dc\u05e4\u05d5\u05df \u05d0\u05d5 \u05d0\u05d9\u05de\u05d9\u05d9\u05dc"}</p>
      </div>
      <div className="add-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder={"\u05d7\u05e4\u05e9 \u05e9\u05dd / \u05d8\u05dc\u05e4\u05d5\u05df"}
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
          <option value="">{'\u05d1\u05d7\u05e8\u05d5 \u05ea\u05dc\u05de\u05d9\u05d3'}</option>
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
          {"\u05d4\u05d5\u05e1\u05e3"}
        </button>
      </div>
    </div>
  )
}

export default AddExistingStudent
