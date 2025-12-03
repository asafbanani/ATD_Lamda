export type Role = 'admin' | 'teacher'

export type PaymentMethod = "cash" | "bank" | "credit" | "check"
export type PaymentAction = { studentId: string; method: PaymentMethod; type: "full" | "partial"; amount?: number }

export type Student = {
  id: string
  firstName?: string
  lastName?: string
  fullName: string
  phone: string
  email?: string
  parentName?: string
  parentPhone?: string
  hours: number
  balance: number
  lastPaymentMethod?: PaymentMethod
}

export type ClassSlot = {
  id: string
  name: string
  teacher: string
  day: string
  date: string
  time: string
  durationHours: number
  room: string
  students: string[]
}

export type AttendanceMap = Record<string, Record<string, boolean>>
