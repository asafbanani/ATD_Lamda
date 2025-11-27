import { useEffect, useMemo, useState } from "react"
import "./App.css"
import QuickMenu from "./components/layout/QuickMenu"
import { initialAttendance, initialClasses, initialStudents } from "./data/seed"
import type { AttendanceMap, ClassSlot, PaymentAction, PaymentMethod, Role, Student } from "./models/types"
import AdminDashboard from "./screens/AdminDashboard"
import AccountsView from "./screens/AccountsView"
import TeacherView from "./screens/TeacherView"

function App() {
  const teacherName = "\u05d9\u05e2\u05dc \u05d1\u05e8\u05d2\u05e8"
  const [role, setRole] = useState<Role>("admin")
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [classes, setClasses] = useState<ClassSlot[]>(initialClasses)
  const [selectedClassId, setSelectedClassId] = useState<string>(initialClasses[0]?.id ?? "")
  const [attendance, setAttendance] = useState<AttendanceMap>(initialAttendance)
  const [adminView, setAdminView] = useState<"calendar" | "accounts">("calendar")

  const teacherClasses = useMemo(
    () => classes.filter((cls) => cls.teacher === teacherName),
    [classes, teacherName],
  )

  const selectedClass = useMemo(
    () => classes.find((cls) => cls.id === selectedClassId) ?? classes[0],
    [classes, selectedClassId],
  )

  useEffect(() => {
    if (role === "teacher" && !teacherClasses.find((cls) => cls.id === selectedClassId)) {
      const fallback = teacherClasses[0]?.id
      if (fallback) setSelectedClassId(fallback)
    }
  }, [role, teacherClasses, selectedClassId])

  const availableStudentsForSelected = useMemo(() => {
    if (!selectedClass) return []
    return students.filter((student) => !selectedClass.students.includes(student.id))
  }, [students, selectedClass])

  const menuItems = useMemo(
    () => [
      { key: "calendar", label: "\u05db\u05d9\u05ea\u05d5\u05ea" },
      { key: "accounts", label: "\u05db\u05e8\u05d8\u05e1\u05ea \u05d7\u05e9\u05d1\u05d5\u05e0\u05d5\u05ea" },
    ],
    [],
  )

  const handleAdminNav = (key: string) => setAdminView(key === "accounts" ? "accounts" : "calendar")

  const toggleAttendance = (classId: string, studentId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [classId]: {
        ...prev[classId],
        [studentId]: !prev[classId]?.[studentId],
      },
    }))
  }

  const clearClassAttendance = (classId: string) => {
    const classToClear = classes.find((cls) => cls.id === classId)
    if (!classToClear) return
    setAttendance((prev) => ({
      ...prev,
      [classId]: Object.fromEntries(classToClear.students.map((studentId) => [studentId, false])),
    }))
  }

  const addStudentToClass = (classId: string, studentId: string) => {
    setClasses((prev) =>
      prev.map((cls) => (cls.id === classId ? { ...cls, students: [...cls.students, studentId] } : cls)),
    )

    setAttendance((prev) => ({
      ...prev,
      [classId]: {
        ...(prev[classId] || {}),
        [studentId]: false,
      },
    }))
  }

  const applyPayments = (payments: PaymentAction[]) => {
    if (payments.length === 0) return
    setStudents((prev) =>
      prev.map((student) => {
        const payment = payments.find((p) => p.studentId === student.id)
        if (!payment) return student
        const amountToSubtract = payment.type === "partial" && payment.amount ? payment.amount : student.balance
        const nextBalance = Math.max(0, student.balance - amountToSubtract)
        return { ...student, balance: nextBalance, lastPaymentMethod: payment.method }
      }),
    )
  }

  return (
    <div className="page">
      <div className="glow glow-1" />
      <div className="glow glow-2" />

      <div className="app-shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">ATD | Lambda</p>
            <h1>{"\u05de\u05e8\u05db\u05d6 \u05d4\u05e9\u05dc\u05d9\u05d8\u05d4"}</h1>
          </div>

          <div className="top-actions">
            {role === "admin" && (
              <QuickMenu items={menuItems} activeKey={adminView} onSelect={handleAdminNav} />
            )}
            <div className="role-switch">
              <button
                type="button"
                className={role === "admin" ? "pill active" : "pill"}
                onClick={() => setRole("admin")}
              >
                {"\u05d0\u05d3\u05de\u05d9\u05df"}
              </button>
              <button
                type="button"
                className={role === "teacher" ? "pill active" : "pill"}
                onClick={() => setRole("teacher")}
              >
                {"\u05de\u05d5\u05e8\u05d4"}
              </button>
            </div>
          </div>
        </header>

        {role === "admin" ? (
          adminView === "accounts" ? (
            <AccountsView students={students} onApplyPayments={applyPayments} />
          ) : (
            <AdminDashboard
              classes={classes}
              students={students}
              selectedClassId={selectedClassId}
              onOpenClass={setSelectedClassId}
            />
          )
        ) : (
          <TeacherView
            classes={teacherClasses}
            teacherName={teacherName}
            selectedClassId={selectedClassId}
            attendance={attendance}
            onSelectClass={setSelectedClassId}
            onToggleAttendance={toggleAttendance}
            onAddStudent={addStudentToClass}
            availableStudents={availableStudentsForSelected}
            studentsLookup={students}
            onClearClass={clearClassAttendance}
          />
        )}
      </div>
    </div>
  )
}

export default App
