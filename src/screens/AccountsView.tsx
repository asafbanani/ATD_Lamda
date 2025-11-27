import { useMemo, useState } from "react"
import type { PaymentAction, PaymentMethod, Student } from "../models/types"

type AccountsViewProps = {
  students: Student[]
  onApplyPayments: (payments: PaymentAction[]) => void
}

const paymentLabels: Record<PaymentMethod, string> = {
  cash: "\u05de\u05d6\u05d5\u05de\u05df",
  bank: "\u05d4\u05e2\u05d1\u05e8\u05d4 \u05d1\u05e0\u05e7\u05d0\u05d9\u05ea",
  credit: "\u05d0\u05e9\u05e8\u05d0\u05d9",
  check: "\u05e6\u05e7",
}

function AccountsView({ students, onApplyPayments }: AccountsViewProps) {
  const [query, setQuery] = useState("")
  const [stagedPayments, setStagedPayments] = useState<
    Record<string, { method?: PaymentMethod; type: "full" | "partial"; amount?: number }>
  >({})
  const [openPickerFor, setOpenPickerFor] = useState<{ studentId: string; mode: "full" | "partial" } | null>(null)
  const balanceById = useMemo(() => Object.fromEntries(students.map((s) => [s.id, s.balance])), [students])

  const owingStudents = useMemo(
    () => {
      const term = query.trim().toLowerCase()
      return students.filter((student) => {
        if (student.balance <= 0) return false
        if (!term) return true
        return (
          student.fullName.toLowerCase().includes(term) ||
          student.phone.toLowerCase().includes(term) ||
          student.email?.toLowerCase().includes(term)
        )
      })
    },
    [students, query],
  )

  const applyChanges = () => {
    const payments: PaymentAction[] = Object.entries(stagedPayments)
      .filter(
        ([studentId, value]) =>
          value.method &&
          (value.type === "full" ||
            (typeof value.amount === "number" &&
              value.amount >= 1 &&
              value.amount <= (balanceById[studentId] ?? Infinity))),
      )
      .map(([studentId, value]) => ({
        studentId,
        method: value.method as PaymentMethod,
        type: value.type,
        amount: value.amount,
      }))
    if (payments.length === 0) return
    onApplyPayments(payments)
    setStagedPayments({})
    setOpenPickerFor(null)
  }

  return (
    <div className="panel accounts-panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">{"\u05db\u05e8\u05d8\u05e1\u05ea \u05d7\u05e9\u05d1\u05d5\u05e0\u05d5\u05ea"}</p>
          <h2>{"\u05ea\u05dc\u05de\u05d9\u05d3\u05d9\u05dd \u05d1\u05d7\u05d5\u05d1"}</h2>
        </div>
        <div className="badge">{`\u05d7\u05d5\u05d1\u05d9\u05dd ${owingStudents.length}`}</div>
      </div>

      <div className="accounts-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder={"\u05d7\u05e4\u05e9 \u05ea\u05dc\u05de\u05d9\u05d3 \u05dc\u05e4\u05d9 \u05e9\u05dd / \u05d8\u05dc\u05e4\u05d5\u05df / \u05d0\u05d9\u05de\u05d9\u05d9\u05dc"}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <button
          type="button"
          className="pill primary"
          disabled={
            Object.entries(stagedPayments).filter(
              ([studentId, value]) =>
                value.method &&
                (value.type === "full" ||
                  (value.amount !== undefined &&
                    value.amount >= 1 &&
                    value.amount <= (balanceById[studentId] ?? Infinity))),
            ).length === 0
          }
          onClick={applyChanges}
        >
          {"\u05d0\u05e9\u05e8 \u05e9\u05d9\u05e0\u05d5\u05d9\u05d9\u05dd"}
        </button>
      </div>

      {owingStudents.length === 0 ? (
        <div className="empty-state">
          <p>{"\u05db\u05e8\u05d2 \u05db\u05de\u05d4 \u05d4\u05db\u05dc \u05e9\u05d5\u05dc\u05dd \u05de\u05d3\u05d5\u05d1\u05d7\u05d5\u05ea"}</p>
        </div>
      ) : (
        <div className="accounts-list">
          {owingStudents.map((student) => {
            const staged = stagedPayments[student.id]
            const isOpen = openPickerFor?.studentId === student.id
            const mode = openPickerFor?.mode
            const partialInvalid =
              staged?.type === "partial" &&
              staged.amount !== undefined &&
              (staged.amount < 1 || staged.amount > student.balance)

            return (
              <div key={student.id} className="account-row">
                <div>
                  <div className="account-title">
                    <strong>{student.fullName}</strong>
                    <span className="badge warning">{`${student.balance} \u05e9\"\u05d7`}</span>
                  </div>
                  <p className="muted">{student.phone}</p>
                  {student.email && <p className="muted">{student.email}</p>}
                  {student.lastPaymentMethod && (
                    <p className="muted small">
                      {`\u05ea\u05e9\u05dc\u05d5\u05dd \u05d0\u05d7\u05e8\u05d5\u05df \u05e2\u05dd ${paymentLabels[student.lastPaymentMethod]}`}
                    </p>
                  )}
                  {staged && staged.method && (
                    <div className="staged-indicator">
                      <span className="pill ghost">
                        {`\u05e9\u05d9\u05e0\u05d5\u05d9\u05d9\u05dd: ${paymentLabels[staged.method]}`}
                        {staged.type === "partial" && staged.amount ? ` | ${staged.amount} \u05e9\"\u05d7` : ""}
                      </span>
                      <button
                        type="button"
                        className="link-button"
                        onClick={() =>
                          setStagedPayments((prev) => {
                            const next = { ...prev }
                            delete next[student.id]
                            return next
                          })
                        }
                      >
                        {"\u05d1\u05d8\u05dc"}
                      </button>
                    </div>
                  )}
                </div>
                <div className="account-actions">
                  <button
                    type="button"
                    className="pill secondary"
                    onClick={() =>
                      setOpenPickerFor((prev) =>
                        prev?.studentId === student.id && prev.mode === "full"
                          ? null
                          : { studentId: student.id, mode: "full" },
                      )
                    }
                  >
                    {"\u05e9\u05d5\u05dc\u05dd"}
                  </button>
                  <button
                    type="button"
                    className="pill secondary"
                    onClick={() =>
                      setOpenPickerFor((prev) =>
                        prev?.studentId === student.id && prev.mode === "partial"
                          ? null
                          : { studentId: student.id, mode: "partial" },
                      )
                    }
                  >
                    {"\u05ea\u05e9\u05dc\u05d5\u05dd \u05d7\u05dc\u05e7\u05d9"}
                  </button>
                  {isOpen && (
                    <div className="method-picker">
                      {(
                        [
                          ["cash", paymentLabels.cash],
                          ["bank", paymentLabels.bank],
                          ["credit", paymentLabels.credit],
                          ["check", paymentLabels.check],
                        ] as [PaymentMethod, string][]
                      ).map(([method, label]) => (
                        <button
                          key={method}
                          type="button"
                          className="menu-item"
                          onClick={() => {
                            setStagedPayments((prev) => ({
                              ...prev,
                              [student.id]: {
                                ...(prev[student.id] ?? { type: mode ?? "full" }),
                                method,
                                type: mode ?? "full",
                              },
                            }))
                            if (mode === "full") setOpenPickerFor(null)
                          }}
                        >
                          {label}
                        </button>
                      ))}
                      {mode === "partial" && (
                        <div className="partial-input">
                          <label htmlFor={`amount-${student.id}`} className="muted small">
                            {"\u05e1\u05db\u05d5\u05dd \u05dc\u05e9\u05dc\u05dd"}
                          </label>
                          <input
                            id={`amount-${student.id}`}
                            type="number"
                            min={1}
                            step={1}
                            placeholder={`1 - ${student.balance}`}
                            value={staged?.amount ?? ""}
                            onChange={(event) => {
                              const raw = event.target.value
                              const numeric = Number(raw)
                              setStagedPayments((prev) => ({
                                ...prev,
                                [student.id]: {
                                  ...(prev[student.id] ?? { type: "partial" }),
                                  amount: raw === "" || Number.isNaN(numeric) ? undefined : numeric,
                                  type: "partial",
                                  method: prev[student.id]?.method,
                                },
                              }))
                            }}
                          />
                          {partialInvalid && (
                            <span className="error-text">
                              {"\u05de\u05e1\u05e4\u05e8 \u05de\u05d7\u05d5\u05e5 \u05dc\u05ea\u05d7\u05d5\u05dd"}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AccountsView
