import type { AttendanceMap, ClassSlot, Student } from "../models/types"

export const initialStudents: Student[] = [
  { id: "s1", fullName: "\u05d0\u05d5\u05e8\u05d9 \u05dc\u05d5\u05d9", phone: "050-1112233", email: "ori@example.com", hours: 42, balance: 350 },
  { id: "s2", fullName: "\u05e0\u05d5\u05e2\u05d4 \u05d3\u05df", phone: "050-2223344", hours: 28, balance: 0 },
  { id: "s3", fullName: "\u05de\u05d0\u05d9\u05d4 \u05e9\u05dc\u05d5", phone: "050-3334455", email: "maya@example.com", hours: 31, balance: 120 },
  { id: "s4", fullName: "\u05d2\u05d9\u05d0 \u05e9\u05dc\u05d5", phone: "050-9998877", hours: 12, balance: 0 },
  { id: "s5", fullName: "\u05ea\u05de\u05e8 \u05d0\u05d5\u05d7\u05e0\u05d4", phone: "050-8887766", hours: 7, balance: 220 },
]

export const initialClasses: ClassSlot[] = [
  { id: "c1", name: "\u05d0\u05d5\u05dc\u05e4\u05df \u05d0\u05f3", teacher: "\u05d9\u05e2\u05dc \u05d1\u05e8\u05d2\u05e8", day: "\u05e8\u05d0\u05e9\u05d5\u05df", time: "10:00", room: "\u05d7\u05d3\u05e8 3", students: ["s1", "s2", "s3"] },
  { id: "c2", name: "\u05d0\u05d5\u05dc\u05e4\u05df \u05d1\u05f3", teacher: "\u05d3\u05e0\u05d9 \u05d1\u05e8", day: "\u05e9\u05e0\u05d9", time: "12:30", room: "\u05d7\u05d3\u05e8 1", students: ["s4", "s5"] },
  { id: "c3", name: "\u05d0\u05d5\u05dc\u05e4\u05df \u05e2\u05e8\u05d1", teacher: "\u05e0\u05e2\u05d4 \u05e4\u05e8\u05d9\u05d3\u05de\u05df", day: "\u05e8\u05d1\u05d9\u05e2\u05d9", time: "18:00", room: "\u05d7\u05d3\u05e8 5", students: ["s1"] },
  { id: "c4", name: "\u05d0\u05d5\u05dc\u05e4\u05df \u05d1\u05d5\u05e7\u05e8 \u05e9\u05d9\u05e9\u05d9", teacher: "\u05d9\u05e2\u05dc \u05d1\u05e8\u05d2\u05e8", day: "\u05e9\u05d9\u05e9\u05d9", time: "09:00", room: "\u05d7\u05d3\u05e8 2", students: ["s2", "s5"] },
]

export const initialAttendance: AttendanceMap = buildAttendanceMap(initialClasses)

export function buildAttendanceMap(classes: ClassSlot[]): AttendanceMap {
  return Object.fromEntries(
    classes.map((cls) => [
      cls.id,
      Object.fromEntries(cls.students.map((studentId) => [studentId, false])),
    ]),
  )
}
