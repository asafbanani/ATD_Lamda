import { useEffect, useMemo, useState } from "react"
import "./App.css"
import logo from "./assets/atd_logo.png"
import { initialAttendance, initialClasses, initialStudents } from "./data/seed"
import type { AttendanceMap, ClassSlot, PaymentAction, PaymentMethod, Role, Student } from "./models/types"
import AdminDashboard from "./screens/AdminDashboard"
import AccountsView from "./screens/AccountsView"
import StudentsView from "./screens/StudentsView"
import TeacherView from "./screens/TeacherView"

function App() {
  const teacherName = "\u05d9\u05e2\u05dc \u05d1\u05e8\u05d2\u05e8"
  const [role, setRole] = useState<Role>("admin")
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [classes, setClasses] = useState<ClassSlot[]>(initialClasses)
  const [selectedClassId, setSelectedClassId] = useState<string>(initialClasses[0]?.id ?? "")
  const [showClassModal, setShowClassModal] = useState(false)
  const [attendance, setAttendance] = useState<AttendanceMap>(initialAttendance)
  const [adminView, setAdminView] = useState<"calendar" | "accounts" | "students">("calendar")

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

    if (role !== "admin") setShowClassModal(false)
  }, [role, teacherClasses, selectedClassId])

  const availableStudentsForSelected = useMemo(() => {
    if (!selectedClass) return []
    return students.filter((student) => !selectedClass.students.includes(student.id))
  }, [students, selectedClass])

  const menuItems = useMemo(
    () => [
      { key: "calendar", label: "\u05db\u05d9\u05ea\u05d5\u05ea", icon: "calendar" },
      { key: "accounts", label: "\u05db\u05e8\u05d8\u05e1\u05ea \u05d7\u05e9\u05d1\u05d5\u05e0\u05d5\u05ea", icon: "accounts" },
      { key: "students", label: "\u05ea\u05dc\u05de\u05d9\u05d3\u05d9\u05dd", icon: "students" },
    ],
    [],
  )

  const handleAdminNav = (key: string) => {
    if (key === "accounts" || key === "students" || key === "calendar") setAdminView(key)
    else setAdminView("calendar")
    if (key !== "calendar") setShowClassModal(false)
  }

  const openAdminClass = (classId: string) => {
    setSelectedClassId(classId)
    setAdminView("calendar")
    setShowClassModal(true)
  }

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

  const updateStudent = (id: string, data: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((student) => (student.id === id ? { ...student, ...data, fullName: data.fullName ?? student.fullName } : student)),
    )
  }

  const addNewStudent = (data: {
    firstName: string
    lastName: string
    phone: string
    email?: string
    parentName?: string
    parentPhone?: string
  }) => {
    const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ").trim()
    const newStudent: Student = {
      id: `s${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: fullName || data.firstName || data.lastName || "Student",
      phone: data.phone,
      email: data.email,
      parentName: data.parentName,
      parentPhone: data.parentPhone,
      hours: 0,
      balance: 0,
    }
    setStudents((prev) => [...prev, newStudent])
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
          <div className="admin-layout">
            <aside className="admin-dashboard">
              <div className="dashboard-logo">
                <img src={logo} alt="\u05dc\u05d5\u05d2\u05d5 ATD \u05dc\u05de\u05d3\u05d0" />
              </div>
              <nav className="dashboard-nav">
                {menuItems.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    className={item.key === adminView ? "dashboard-link active" : "dashboard-link"}
                    onClick={() => handleAdminNav(item.key)}
                  >
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-icon" aria-hidden="true">
                      {item.icon === "calendar" && (
                        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v4H3V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1Z" />
                          <path d="M3 11h18v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7Zm5 3v2h2v-2H8Zm4 0v2h2v-2h-2Zm4 0v2h2v-2h-2Z" />
                        </svg>
                      )}
                      {item.icon === "accounts" && (
                        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.5 3A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8.414a1.5 1.5 0 0 0-.44-1.06l-3.914-3.914A1.5 1.5 0 0 0 13.586 3h-7.086Zm7 0.75L18.25 8.5H14A1.5 1.5 0 0 1 12.5 7V3.75Zm-5 6.75h6a.75.75 0 1 1 0 1.5h-6a.75.75 0 0 1 0-1.5Zm0 3h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1 0-1.5Z" />
                        </svg>
                      )}
                      {item.icon === "students" && (
                        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 3.5c-1.933 0-3.5 1.567-3.5 3.5S10.067 10.5 12 10.5s3.5-1.567 3.5-3.5S13.933 3.5 12 3.5ZM7 13a3 3 0 0 0-3 3v3h16v-3a3 3 0 0 0-3-3H7Z" />
                        </svg>
                      )}
                    </span>
                  </button>
                ))}
              </nav>
            </aside>

            <div className="admin-main">
              {adminView === "accounts" ? (
                <AccountsView students={students} onApplyPayments={applyPayments} />
              ) : adminView === "students" ? (
                <StudentsView students={students} onAddStudent={addNewStudent} onUpdateStudent={updateStudent} />
              ) : (
                <AdminDashboard
                  classes={classes}
                  students={students}
                  selectedClassId={selectedClassId}
                  onOpenClass={openAdminClass}
                  showClassModal={showClassModal}
                  onCloseClassModal={() => setShowClassModal(false)}
                />
              )}
            </div>
          </div>
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
