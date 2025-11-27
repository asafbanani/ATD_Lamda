import type { ClassSlot, Student } from "../models/types"

type AdminDashboardProps = {
  classes: ClassSlot[]
  students: Student[]
  onMarkPaid: (studentId: string) => void
  onOpenClass: (classId: string) => void
}

function AdminDashboard({ classes, students, onMarkPaid, onOpenClass }: AdminDashboardProps) {
  const openBalances = students.filter((student) => student.balance > 0)

  return (
    <div className="grid">
      <section className="panel admin-card">
        <div className="section-head">
          <div>
            <p className="eyebrow">{"\u05d9\u05d5\u05de\u05df \u05e9\u05d1\u05d5\u05e2\u05d9"}</p>
            <h2>{"\u05e9\u05d1\u05d5\u05e2 12-18 \u05d1\u05d9\u05e0\u05d5\u05d0\u05e8"}</h2>
          </div>
          <div className="chip-row">
            <button type="button" className="pill secondary">
              {"\u05e9\u05d1\u05d5\u05e2 \u05e7\u05d5\u05d3\u05dd"}
            </button>
            <button type="button" className="pill secondary">
              {"\u05e9\u05d1\u05d5\u05e2 \u05d4\u05d1\u05d0"}
            </button>
          </div>
        </div>

        <div className="class-grid">
          {classes.map((cls) => (
            <article key={cls.id} className="card" onClick={() => onOpenClass(cls.id)}>
              <div className="card-head">
                <p className="eyebrow">{cls.day}</p>
                <span className="badge">{"\u05db\u05d9\u05ea\u05d4"}</span>
              </div>
              <h3>{cls.name}</h3>
              <p className="muted">
                {cls.teacher} | {cls.time} | {cls.room}
              </p>
              <div className="meta-row">
                <span>{"\u05ea\u05dc\u05de\u05d9\u05d3\u05d9\u05dd"}: {cls.students.length}</span>
                <span>{"\u05d7\u05d3\u05e8"}: {cls.room}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel admin-card">
        <div className="section-head">
          <div>
            <p className="eyebrow">{"\u05db\u05e8\u05d8\u05e1\u05ea"}</p>
            <h2>{"\u05e1\u05d8\u05d8\u05d5\u05e1 \u05ea\u05e9\u05dc\u05d5\u05de\u05d9\u05dd"}</h2>
          </div>
        </div>

        <ul className="ledger">
          {openBalances.length === 0 && <li className="muted">{"\u05d0\u05d9\u05df \u05d7\u05d5\u05d1\u05d5\u05ea \u05e4\u05ea\u05d5\u05d7\u05d9\u05dd"}</li>}
          {openBalances.map((student) => (
            <li key={student.id} className="ledger-row">
              <div>
                <strong>{student.fullName}</strong>
                <p className="muted">
                  {student.phone}
                  {student.email ? ` | ${student.email}` : ""}
                </p>
              </div>
              <div className="ledger-actions">
                <span className="amount">{`\u20aa${student.balance}`}</span>
                <button type="button" className="pill primary" onClick={() => onMarkPaid(student.id)}>
                  {"\u05e1\u05de\u05df \u05e9\u05d5\u05dc\u05dd"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default AdminDashboard
