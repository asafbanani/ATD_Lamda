import type { ClassSlot, Student } from "../../models/types"
import DetailItem from "./DetailItem"

type ClassDetailsProps = {
  selectedClass?: ClassSlot
  selectedStudents: Student[]
  nextDate: string | null
}

function ClassDetails({ selectedClass, selectedStudents, nextDate }: ClassDetailsProps) {
  if (!selectedClass) {
    return (
      <div className="empty-state">
        <p className="eyebrow">{"\u05d0\u05d9\u05df \u05db\u05d9\u05ea\u05d5\u05ea"}</p>
        <h3>{"\u05e0\u05de\u05ea\u05d9\u05df \u05dc\u05d0\u05e4\u05e1 \u05db\u05d9\u05ea\u05d4"}</h3>
      </div>
    )
  }

  return (
    <>
      <p className="eyebrow">{"\u05e4\u05e8\u05d8\u05d9 \u05db\u05d9\u05ea\u05d4"}</p>
      <h2>{selectedClass.name}</h2>
      <p className="muted">
        {selectedClass.teacher} | {selectedClass.day} | {selectedClass.time}
      </p>

      <div className="detail-grid">
        <DetailItem label={"\u05de\u05d5\u05e8\u05d4"} value={selectedClass.teacher} />
        <DetailItem label={"\u05d9\u05d5\u05dd"} value={selectedClass.day} />
        <DetailItem label={"\u05e9\u05e2\u05d4"} value={selectedClass.time} />
        <DetailItem label={"\u05d7\u05d3\u05e8"} value={selectedClass.room} />
        <DetailItem label={"\u05ea\u05d0\u05e8\u05d9\u05da"} value={nextDate ?? "-"} />
        <DetailItem label={"\u05de\u05e1\u05e4\u05e8 \u05ea\u05dc\u05de\u05d9\u05d3\u05d9\u05dd"} value={`${selectedClass.students.length}`} />
      </div>

      <div className="student-list">
        <div className="detail-row">
          <h4>{"\u05ea\u05dc\u05de\u05d9\u05d3\u05d9\u05dd \u05d1\u05db\u05d9\u05ea\u05d4"}</h4>
          <span className="badge subtle">{selectedClass.students.length}</span>
        </div>
        {selectedStudents.length === 0 && <p className="muted">{"\u05e2\u05d3\u05d9\u05d9\u05df \u05d0\u05d9\u05df \u05ea\u05dc\u05de\u05d9\u05d3\u05d9\u05dd \u05e9\u05d9\u05d5\u05d7\u05dd"}</p>}
        <ul>
          {selectedStudents.map(
            (student) =>
              student && (
                <li key={student.id} className="student-chip">
                  <strong>{student.fullName}</strong>
                  <span className="muted">{student.phone}</span>
                </li>
              ),
          )}
        </ul>
      </div>
    </>
  )
}

export default ClassDetails
