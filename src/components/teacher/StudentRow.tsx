import type { Student } from "../../models/types"

type ChargeState = "half" | "full" | undefined

type StudentRowProps = {
  student?: Student
  studentId: string
  isPresent: boolean
  pendingCharge: ChargeState
  sentCharge: ChargeState
  onToggleAttendance: () => void
  onSetPendingCharge: (amount: "half" | "full") => void
}

function StudentRow({
  student,
  studentId,
  isPresent,
  pendingCharge,
  sentCharge,
  onToggleAttendance,
  onSetPendingCharge,
}: StudentRowProps) {
  return (
    <div key={studentId} className="student-row">
      <label className="checkbox">
        <input type="checkbox" checked={isPresent} onChange={onToggleAttendance} />
        <span />
      </label>
      <div className="student-meta">
        <strong>{student?.fullName ?? "\u05dc\u05d0 \u05e0\u05de\u05e6\u05d0"}</strong>
        <p className="muted">{student?.phone}</p>
      </div>
      <span className={`status ${isPresent ? "ok" : "pending"}`}>{isPresent ? "\u05e0\u05d5\u05db\u05d7" : "\u05d7\u05e1\u05e8"}</span>
      <div className="charge-actions">
        {isPresent &&
          (sentCharge ? (
            <span className="badge">
              {"\u05d7\u05d9\u05d5\u05d1 \u05e0\u05e9\u05dc\u05d7"} - {sentCharge === "full" ? "\u05ea\u05e9\u05dc\u05d5\u05dd \u05de\u05dc\u05d0" : "\u05d7\u05e6\u05d9 \u05ea\u05e9\u05dc\u05d5\u05dd"}
            </span>
          ) : pendingCharge ? (
            <span className="badge">
              {"\u05d7\u05d9\u05d5\u05d1 \u05de\u05de\u05ea\u05d9\u05df"} - {pendingCharge === "full" ? "\u05ea\u05e9\u05dc\u05d5\u05dd \u05de\u05dc\u05d0" : "\u05d7\u05e6\u05d9 \u05ea\u05e9\u05dc\u05d5\u05dd"}
            </span>
          ) : (
            <>
              <button type="button" className="pill secondary" onClick={() => onSetPendingCharge("half")}>
                {"\u05d7\u05e6\u05d9 \u05ea\u05e9\u05dc\u05d5\u05dd"}
              </button>
              <button type="button" className="pill primary" onClick={() => onSetPendingCharge("full")}>
                {"\u05ea\u05e9\u05dc\u05d5\u05dd \u05de\u05dc\u05d0"}
              </button>
            </>
          ))}
      </div>
    </div>
  )
}

export default StudentRow
